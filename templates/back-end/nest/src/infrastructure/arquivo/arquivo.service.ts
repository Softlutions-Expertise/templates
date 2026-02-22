import {
  ForbiddenException,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ItemBucketMetadata } from 'minio';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import * as sharp from 'sharp';
import slug from 'slug';
import { v4 } from 'uuid';
import { AcessoControl } from '../acesso-control';
import { MinioClient } from './minio/providers/minio-client.provider';

interface ArquivoServiceMetadataInput {
  nomeArquivo: string;
  tipoArquivo: string;
  nameSizeFile: string;
  byteString: string;
}

const base64ToBuffer = (base64: string) => {
  const sep = 'base64,';
  const encodedPart = base64.includes(sep)
    ? base64.slice(base64.indexOf(sep) + sep.length)
    : base64;

  const buffer = Buffer.from(encodedPart, 'base64');

  return {
    buffer,
  };
};

/**
 * Enum com os tipos de arquivo suportados.
 * Adicione novos tipos conforme necessário.
 */
export enum FileKind {
  PESSOA_FOTO_PERFIL = 'v1/pessoa/foto-perfil',
  GENERICO_DOCUMENTO = 'v1/generico/documento',
}

type IObjectMetadataBase = {
  'mime-type': string;
  'file-name': string;
  date: string;
  'actor-id': string | null;
};

type IObjectMetadataKindPessoaFotoPerfil = IObjectMetadataBase & {
  kind: FileKind.PESSOA_FOTO_PERFIL;
  'pessoa-id': string;
};

type IObjectMetadataKindGenericoDocumento = IObjectMetadataBase & {
  kind: FileKind.GENERICO_DOCUMENTO;
  'documento-id': string;
  'entidade-tipo': string;
  'entidade-id': string;
};

type IObjectMetadata =
  | IObjectMetadataKindPessoaFotoPerfil
  | IObjectMetadataKindGenericoDocumento;

const buildObjectNamePessoa = (idPessoa: string) => {
  return `pessoa::${idPessoa}::foto-perfil::${v4()}`;
};

const buildObjectNameGenericoDocumento = (
  entidadeTipo: string,
  entidadeId: string,
  documentoId: string,
) => {
  return `generico::${entidadeTipo}::${entidadeId}::documento::${documentoId}::${v4()}`;
};

class ForbiddenFileViewException extends ForbiddenException {
  constructor(meta: IObjectMetadata) {
    super(
      `Permissão negada para visualizar esse recurso (kind: ${meta.kind}).`,
    );
  }
}

@Injectable()
export class ArquivoService {
  #submitImageQueue = new PQueue({
    concurrency: 20,
    timeout: 90_000,
    throwOnTimeout: true,
  });

  #processImageQueue = new PQueue({
    concurrency: 3,
    timeout: 30_000,
    throwOnTimeout: true,
  });

  private async processImageFromBuffer(inputBuffer: Buffer) {
    return await pRetry(
      () => {
        return this.#processImageQueue.add(async () => {
          const buffer = await sharp(inputBuffer).jpeg({}).toBuffer();

          return {
            buffer,
            mimetype: 'image/jpeg',
            extension: '.jpg',
          };
        });
      },
      {
        retries: 10,
        randomize: true,
        onFailedAttempt(error) {
          console.debug(error);
        },
      },
    );
  }

  private async processImageFromBase64(base64: string) {
    const { buffer } = base64ToBuffer(base64);
    return this.processImageFromBuffer(buffer);
  }

  constructor(
    @Inject(MinioClient)
    private minioClient: MinioClient,
  ) {}

  get bucketName() {
    return process.env.MINIO_BUCKET_NAME;
  }

  private uploadFromBuffer(
    actorId: string | null,
    objectName: string,
    buffer: Buffer,
    metadata: ItemBucketMetadata,
  ) {
    const MAX_RETRIES = 3;

    return pRetry(
      (tentativa) => {
        return this.#submitImageQueue.add(() => {
          if (tentativa > 1) {
            console.log(
              `tentando enviar arquivo... [${tentativa - 1}/${MAX_RETRIES}]`,
            );
          }

          return this.minioClient.putObject(
            this.bucketName,
            objectName,
            buffer,
            null,
            {
              ...metadata,
              'file-name': metadata['file-name']
                ? encodeURIComponent(metadata['file-name'])
                : 'untitled',
              'actor-id': actorId ?? '',
              date: new Date().toISOString(),
            },
          );
        });
      },
      {
        retries: MAX_RETRIES,
        onFailedAttempt(error) {
          console.debug(error);
          console.trace('erro ao enviar arquivo');
        },
      },
    );
  }

  private uploadFromBase64(
    actorId: string | null,
    objectName: string,
    base64: string,
    metadata: ItemBucketMetadata,
  ) {
    const { buffer } = base64ToBuffer(base64);

    return this.uploadFromBuffer(actorId, objectName, buffer, {
      ...metadata,
    });
  }

  private async uploadPictureFromBase64<
    T extends Omit<
      IObjectMetadata,
      'file-name' | 'mime-type' | 'actor-id' | 'date'
    >,
  >(
    acessoControl: AcessoControl | null,
    objectName: string,
    base64: string,
    baseName: string,
    metadata: T,
  ) {
    const img = await this.processImageFromBase64(base64);

    await this.uploadFromBuffer(
      acessoControl?.currentFuncionario?.id,
      objectName,
      img.buffer,
      {
        ...metadata,
        'mime-type': img.mimetype,
        'file-name': `${baseName}${img.extension}`,
      },
    );

    return objectName;
  }

  /**
   * Faz upload de foto de perfil de uma pessoa
   */
  async uploadProfilePictureFromBase64(
    acessoControl: AcessoControl | null,
    idPessoa: string,
    base64: string,
  ) {
    const objectName = buildObjectNamePessoa(idPessoa);

    await this.uploadPictureFromBase64(
      acessoControl,
      objectName,
      base64,
      `pessoa-${idPessoa}-foto-perfil`,
      {
        kind: FileKind.PESSOA_FOTO_PERFIL,
        'pessoa-id': idPessoa,
      },
    );

    return objectName;
  }

  /**
   * Faz upload de documento genérico vinculado a uma entidade
   */
  async uploadDocumentoFromBase64(
    acessoControl: AcessoControl | null,
    entidadeTipo: string,
    entidadeId: string,
    documentoId: string,
    base64: string,
    arquivoMeta: ArquivoServiceMetadataInput,
  ) {
    const objectName = buildObjectNameGenericoDocumento(
      entidadeTipo,
      entidadeId,
      documentoId,
    );

    await this.uploadFromBase64(
      acessoControl?.currentFuncionario?.id,
      objectName,
      base64,
      {
        kind: FileKind.GENERICO_DOCUMENTO,
        'entidade-tipo': entidadeTipo,
        'entidade-id': entidadeId,
        'documento-id': documentoId,
        'mime-type': arquivoMeta.tipoArquivo,
        'file-name': arquivoMeta.nomeArquivo,
      },
    );

    return objectName;
  }

  /**
   * Faz upload de arquivo genérico (qualquer tipo)
   */
  async uploadArquivoGenerico(
    acessoControl: AcessoControl | null,
    objectName: string,
    buffer: Buffer,
    metadata: ItemBucketMetadata,
  ) {
    return this.uploadFromBuffer(
      acessoControl?.currentFuncionario?.id,
      objectName,
      buffer,
      metadata,
    );
  }

  private async getFileObject(objectName: string) {
    try {
      const stat = await this.minioClient.statObject(
        this.bucketName,
        objectName,
      );

      const meta = stat.metaData as IObjectMetadata;

      return {
        stat,
        meta,
        getStream: () => {
          return this.minioClient.getObject(this.bucketName, objectName);
        },
      };
    } catch (_) {
      return null;
    }
  }

  async getUploadedFileByAccessToken(
    acessoControl: AcessoControl | null,
    objectName: string,
  ) {
    const file = await this.getFileObject(objectName);

    if (!file) {
      return null;
    }

    if (acessoControl) {
      switch (file.meta.kind) {
        case FileKind.PESSOA_FOTO_PERFIL: {
          // Verifica se o usuário tem permissão para ver a foto da pessoa
          await acessoControl.ensureCanReachTarget(
            'pessoa:read',
            null,
            file.meta['pessoa-id'],
          );
          break;
        }

        case FileKind.GENERICO_DOCUMENTO: {
          // Verifica permissão baseada no tipo de entidade
          const entidadeTipo = file.meta['entidade-tipo'];
          await acessoControl.ensureCanReachTarget(
            `${entidadeTipo}:read`,
            null,
            file.meta['entidade-id'],
          );
          break;
        }

        default: {
          throw new NotImplementedException(
            `Validação de acesso não implementada para recurso "${file.meta.kind}".`,
          );
        }
      }
    }

    const stream = await file.getStream();

    slug.charmap['.'] = '.';

    const headers = {
      'Content-Type': `${file.meta['mime-type']}`,
      'Content-Disposition': `attachment; filename=${slug(
        file.meta['file-name'],
      )}`,
    };

    return {
      stream,
      headers,
    };
  }

  /**
   * Gera URL pré-assinada para acesso temporário ao arquivo
   */
  async getPresignedUrl(
    objectName: string,
    expirySeconds: number = 3600,
  ): Promise<string> {
    return this.minioClient.presignedGetObject(
      this.bucketName,
      objectName,
      expirySeconds,
    );
  }
}
