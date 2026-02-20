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
import { DatabaseContextService } from '../database-context/database-context.service';
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

enum FileKind {
  PESSOA_FOTO_PERFIL = 'v1/pessoa/foto-perfil',
  ESCOLA_FOTO_PRINCIPAL = 'v1/escola/foto-principal',
  SECRETARIA_MUNICIPAL_LOGO = 'v1/secretaria-municipal/logo',
  ENTREVISTA_COMPROVANTE_CRITERIO = 'v1/entrevista/comprovante-criterio',
  REGISTRO_CONTATO = 'v1/entrevista/registrar-contato',
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

type IObjectMetadataKindEscolaFotoPrincipal = IObjectMetadataBase & {
  kind: FileKind.ESCOLA_FOTO_PRINCIPAL;
  'escola-id': string;
};

type IObjectMetadataKindSecretariaMunicipalLogo = IObjectMetadataBase & {
  kind: FileKind.SECRETARIA_MUNICIPAL_LOGO;
  'secretaria-municipal-id': string;
};

type IObjectMetadataKindEntrevistaComprovanteCriterio = IObjectMetadataBase & {
  kind: FileKind.ENTREVISTA_COMPROVANTE_CRITERIO;
  'criterio-id': string;
  'entrevista-id': string;
};

type IObjectMetadataKindContatoRegistro = IObjectMetadataBase & {
  kind: FileKind.REGISTRO_CONTATO;
  'contato-id': string;
};

type IObjectMetadata =
  | IObjectMetadataKindPessoaFotoPerfil
  | IObjectMetadataKindEscolaFotoPrincipal
  | IObjectMetadataKindSecretariaMunicipalLogo
  | IObjectMetadataKindEntrevistaComprovanteCriterio
  | IObjectMetadataKindContatoRegistro;

const buildObjectNamePessoa = (idPessoa: string) => {
  return `pessoa::${idPessoa}::foto-perfil::${v4()}`;
};

const buildObjectNameEscolaFotoPrincipal = (idEscola: string) => {
  return `escola::${idEscola}::foto-principal::${v4()}`;
};

const buildObjectNameSecretariaMunicipalLogo = (
  idSecretariaMunicipal: string,
) => {
  return `secretaria-municipal::${idSecretariaMunicipal}::logo::${v4()}`;
};

const buildObjectNameEntrevistaCriterio = (
  idEntrevista: string,
  idCriterio: string,
) => {
  return `entrevista::${idEntrevista}::comprovantes-criterios::${idCriterio}::${v4()}`;
};

const buildObjectNameContato = (idContato: string) => {
  return `registro-contato::${idContato}::comprovante::${v4()}`;
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
    private databaseContextService: DatabaseContextService,

    @Inject(MinioClient)
    private minioClient: MinioClient,
  ) { }

  get bucketName() {
    return process.env.MINIO_BUCKET_NAME;
  }

  get arquivoRepository() {
    return this.databaseContextService.arquivoRepository;
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
              `tentando enviar imagem... [${tentativa - 1}/${MAX_RETRIES}]`,
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
          console.trace('erro ao enviar imagem');
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

  async uploadSchoolPictureFromBase64(
    acessoControl: AcessoControl | null,
    idEscola: string,
    base64: string,
  ) {
    const objectName = buildObjectNameEscolaFotoPrincipal(idEscola);

    await this.uploadPictureFromBase64(
      acessoControl,
      objectName,
      base64,
      `funcionario-${idEscola}-foto-principal`,
      {
        kind: FileKind.ESCOLA_FOTO_PRINCIPAL,
        'escola-id': idEscola,
      },
    );

    return objectName;
  }

  async uploadSecretariaMunicipalLogoFromBase64(
    acessoControl: AcessoControl | null,
    idSecretariaMunicipal: string,
    base64: string,
  ) {
    const objectName = buildObjectNameSecretariaMunicipalLogo(
      idSecretariaMunicipal,
    );

    await this.uploadPictureFromBase64(
      acessoControl,
      objectName,
      base64,
      `secretaria-municipal-${idSecretariaMunicipal}-logo`,
      {
        kind: FileKind.SECRETARIA_MUNICIPAL_LOGO,
        'secretaria-id': idSecretariaMunicipal,
      },
    );

    return objectName;
  }

  async uploadInterviewCriterionFromBase64(
    acessoControl: AcessoControl | null,

    idEntrevista: string,
    idCriterio: string,

    base64: string,

    arquivoMeta: ArquivoServiceMetadataInput,

    createFile = true,
  ) {
    const objectName = buildObjectNameEntrevistaCriterio(
      idEntrevista,
      idCriterio,
    );

    await this.uploadFromBase64(
      acessoControl?.currentFuncionario?.id,
      objectName,
      base64,
      {
        kind: FileKind.ENTREVISTA_COMPROVANTE_CRITERIO,

        'criterio-id': idCriterio,
        'entrevista-id': idEntrevista,

        'mime-type': arquivoMeta.tipoArquivo,
        'file-name': arquivoMeta.nomeArquivo,
      },
    );

    const arquivo = this.databaseContextService.arquivoRepository.create({
      id: v4(),

      nomeArquivo: arquivoMeta.nomeArquivo,
      tipoArquivo: arquivoMeta.tipoArquivo,
      nameSizeFile: arquivoMeta.nameSizeFile,
      byteString: arquivoMeta.byteString,

      accessToken: objectName,
    });

    if (createFile) {
      await this.databaseContextService.arquivoRepository.save(arquivo);
    }

    return { arquivo, objectName };
  }

  async uploadRegistroContato(acessoControl: AcessoControl | null, idContato: string, base64: string) {
    const objectName = buildObjectNameContato(idContato);
    //TODO ajsutar pada qualquer tipod e arquivo
    await this.uploadPictureFromBase64(
      acessoControl,
      objectName,
      base64,
      `registro-contato-${idContato}-comprovante`,
      {
        kind: FileKind.REGISTRO_CONTATO,
        'contato-id': idContato,

      },
    );

    return objectName;
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
        case FileKind.ESCOLA_FOTO_PRINCIPAL: {
          await acessoControl.ensureCanReachTarget(
            'escola:read',
            null,
            file.meta['escola-id'],
          );
          break;
        }

        case FileKind.SECRETARIA_MUNICIPAL_LOGO: {
          await acessoControl.ensureCanReachTarget(
            'secretaria:read',
            null,
            file.meta['secretaria-municipal-id'],
          );
          break;
        }

        case FileKind.PESSOA_FOTO_PERFIL: {
          const funcionario =
            await this.databaseContextService.funcionarioRepository
              .createQueryBuilder('funcionario')
              .innerJoin('funcionario.pessoa', 'pessoa')
              .where('pessoa.id = :idPessoa', {
                idPessoa: file.meta['pessoa-id'],
              })
              .select('funcionario.id')
              .getOne();

          if (funcionario) {
            await acessoControl.ensureCanReachTarget(
              'servidor:read',
              null,
              funcionario.id,
            );

            break;
          }

          throw new ForbiddenFileViewException(file.meta);
        }

        case FileKind.ENTREVISTA_COMPROVANTE_CRITERIO: {
          await acessoControl.ensureCanReachTarget(
            'entrevista:read',
            null,
            file.meta['entrevista-id'],
          );

          break;
        }

        case FileKind.REGISTRO_CONTATO: {
          await acessoControl.ensureCanReachTarget(
            'registro_contato:read',
            null,
            file.meta['registro-contato-id'],
          );

          break;
        }

        default: {
          throw new NotImplementedException(
            `Validação de acesso não implementada para recurso "${file.meta}".`,
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
}
