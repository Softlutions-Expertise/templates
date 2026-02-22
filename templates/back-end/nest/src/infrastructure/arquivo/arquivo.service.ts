import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ItemBucketMetadata } from 'minio';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import * as sharp from 'sharp';
import slug from 'slug';
import { v4 } from 'uuid';
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

type IObjectMetadataPessoaFotoPerfil = IObjectMetadataBase & {
  kind: FileKind.PESSOA_FOTO_PERFIL;
  'pessoa-id': string;
};

type IObjectMetadataGenericoDocumento = IObjectMetadataBase & {
  kind: FileKind.GENERICO_DOCUMENTO;
  'entidade-tipo': string;
  'entidade-id': string;
};

type IObjectMetadata =
  | IObjectMetadataPessoaFotoPerfil
  | IObjectMetadataGenericoDocumento;

interface SaveFileFromBase64Input {
  kind: FileKind;
  file: ArquivoServiceMetadataInput;
  meta: Record<string, string>;
}

@Injectable()
export class ArquivoService {
  private readonly bucketName = 'arquivos';
  private readonly uploadQueue = new PQueue({ concurrency: 1 });

  constructor(
    @Inject(MinioClient)
    private readonly minioClient: MinioClient,
  ) {
    this.setupBucket();
  }

  private async setupBucket() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  private async uploadFromBuffer(
    actorId: string | null | undefined,
    objectName: string,
    buffer: Buffer,
    metadata: ItemBucketMetadata,
  ) {
    const object = await this.minioClient.putObject(
      this.bucketName,
      objectName,
      buffer,
      buffer.length,
      metadata,
    );

    return {
      objectName,
      etag: object.etag,
    };
  }

  private async saveFileFromBase64(
    actorId: string | null | undefined,
    input: SaveFileFromBase64Input,
  ) {
    const { kind, file, meta } = input;

    const objectName = `${kind}/${v4()}`;

    const { buffer } = base64ToBuffer(file.byteString);

    const metadata: ItemBucketMetadata = {
      ...meta,
      'mime-type': file.tipoArquivo,
      'file-name': file.nomeArquivo,
      date: new Date().toISOString(),
      'actor-id': actorId ?? null,
      kind,
    };

    return this.uploadFromBuffer(
      actorId,
      objectName,
      buffer,
      metadata,
    );
  }

  async savePessoaFotoPerfil(
    actorId: string | null | undefined,
    pessoaId: string,
    file: ArquivoServiceMetadataInput,
  ) {
    const objectName = `${FileKind.PESSOA_FOTO_PERFIL}/${pessoaId}`;

    const { buffer } = base64ToBuffer(file.byteString);

    // Redimensiona a imagem para otimizar
    const resizedBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    const metadata: ItemBucketMetadata = {
      'mime-type': 'image/jpeg',
      'file-name': file.nomeArquivo,
      date: new Date().toISOString(),
      'actor-id': actorId ?? null,
      kind: FileKind.PESSOA_FOTO_PERFIL,
      'pessoa-id': pessoaId,
    };

    return this.uploadQueue.add(() =>
      this.uploadFromBuffer(
        actorId,
        objectName,
        resizedBuffer,
        metadata,
      ),
    );
  }

  async saveGenericoDocumento(
    actorId: string | null | undefined,
    entidadeTipo: string,
    entidadeId: string,
    file: ArquivoServiceMetadataInput,
  ) {
    const objectName = `${FileKind.GENERICO_DOCUMENTO}/${entidadeTipo}/${entidadeId}/${v4()}`;

    const { buffer } = base64ToBuffer(file.byteString);

    const metadata: ItemBucketMetadata = {
      'mime-type': file.tipoArquivo,
      'file-name': file.nomeArquivo,
      date: new Date().toISOString(),
      'actor-id': actorId ?? null,
      kind: FileKind.GENERICO_DOCUMENTO,
      'entidade-tipo': entidadeTipo,
      'entidade-id': entidadeId,
    };

    return this.uploadQueue.add(() =>
      this.uploadFromBuffer(
        actorId,
        objectName,
        buffer,
        metadata,
      ),
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
    objectName: string,
  ) {
    const file = await this.getFileObject(objectName);

    if (!file) {
      return null;
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
      headers,
      stream,
    };
  }

  async deleteFile(objectName: string) {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }

  /**
   * @deprecated Use savePessoaFotoPerfil instead
   */
  async uploadProfilePictureFromBase64(
    actorId: string | null | undefined,
    pessoaId: string,
    base64String: string,
  ) {
    const file = {
      nomeArquivo: `foto-${pessoaId}.jpg`,
      tipoArquivo: 'image/jpeg',
      nameSizeFile: 'foto-perfil',
      byteString: base64String,
    };
    
    const result = await this.savePessoaFotoPerfil(actorId, pessoaId, file);
    return result.objectName;
  }
}
