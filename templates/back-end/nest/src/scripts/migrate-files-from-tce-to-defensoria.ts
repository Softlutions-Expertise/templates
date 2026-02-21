import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { useContainer } from 'class-validator';
import { decode } from 'jsonwebtoken';
import { ObjectLiteral, Repository } from 'typeorm';
import { ArquivoService } from '../infrastructure/arquivo/arquivo.service';
import { DatabaseContextService } from '../infrastructure/database-context/database-context.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { EntrevistaMatchCriterioEntity } from '../modules/entrevista/entities/etrevista_match_criterio.entity';
import { EscolaEntity } from '../modules/escola/entities/escola.entity';
import { PessoaEntity } from '../modules/pessoa/entities/pessoa.entity';

@Module({
  imports: [InfrastructureModule],
  controllers: [],
  providers: [],
})
class CustomModule {}

function detectFile(accessToken: string) {
  try {
    const decoded = decode(accessToken);

    if (typeof decoded !== 'string') {
      if (decoded.applicationId) {
        switch (decoded.applicationId) {
          case '41b6b0f4-170f-47e4-9016-e401b16a0e99': {
            return {
              id: 'tce/prod',

              fetcher: async (): Promise<Buffer> => {
                const res = await axios.get(
                  `https://fila-de-espera-api.tcero.tc.br/base/arquivos/${accessToken}`,
                  { responseType: 'arraybuffer' },
                );

                return res.data;
              },
            };
          }

          default: {
            break;
          }
        }
      }
    }
  } catch (e) {}

  return null;
}

type IUpdateToPerform<T> = {
  getRepository: (
    databaseContextService: DatabaseContextService,
  ) => Repository<T>;

  getRows(databaseContextService: DatabaseContextService): AsyncIterable<T>;

  handle(
    entity: T,
    databaseContextService: DatabaseContextService,
    arquivoService: ArquivoService,
  ): Promise<void>;
};

const createUpdateToPerform = <
  T,
  UpdateToPerform extends IUpdateToPerform<T> = IUpdateToPerform<T>,
>(
  options: UpdateToPerform,
) => options;

const updatesToPerform: IUpdateToPerform<ObjectLiteral & { id: any }>[] = [
  createUpdateToPerform<EscolaEntity>({
    getRepository: (databaseContextService) =>
      databaseContextService.escolaRepository,

    async *getRows(databaseContextService) {
      const repository = databaseContextService.escolaRepository;

      const rows = await repository
        .createQueryBuilder('row')
        .select('row.id')
        .where("row.foto LIKE '%.%.%'")
        .getMany();

      yield* rows;
    },

    async handle(entity, databaseContextService, arquivoService) {
      const detected = detectFile(entity.foto);

      if (!detected) {
        return;
      }

      const buffer = await detected.fetcher();

      const newReference = await arquivoService.uploadSchoolPictureFromBase64(
        null,
        entity.id,
        buffer.toString('base64'),
      );

      await databaseContextService.escolaRepository
        .createQueryBuilder()
        .update()
        .set({
          foto: newReference,
        })
        .whereInIds([entity.id])
        .execute();
    },
  }),
  createUpdateToPerform<PessoaEntity>({
    getRepository: (databaseContextService) =>
      databaseContextService.pessoaRepository,

    async *getRows(databaseContextService) {
      const repository = databaseContextService.pessoaRepository;

      const rows = await repository
        .createQueryBuilder('row')
        .select('row.id')
        .where("row.foto LIKE '%.%.%'")
        .getMany();

      yield* rows;
    },

    async handle(entity, databaseContextService, arquivoService) {
      const detected = detectFile(entity.foto);

      if (!detected) {
        return;
      }

      const buffer = await detected.fetcher();

      const newReference = await arquivoService.uploadProfilePictureFromBase64(
        null,
        entity.id,
        buffer.toString('base64'),
      );

      await databaseContextService.pessoaRepository
        .createQueryBuilder()
        .update()
        .set({
          foto: newReference,
        })
        .whereInIds([entity.id])
        .execute();
    },
  }),

  createUpdateToPerform<EntrevistaMatchCriterioEntity>({
    getRepository: (databaseContextService) =>
      databaseContextService.entrevistaMatchCriterioRepository,

    async *getRows(databaseContextService) {
      const repository =
        databaseContextService.entrevistaMatchCriterioRepository;

      const rows = await repository
        .createQueryBuilder('row')
        .innerJoin('row.arquivo', 'arquivo')
        .where("arquivo.accessToken LIKE '%.%.%'")
        .select('row.id')
        .getMany();

      yield* rows;
    },

    async handle(entityRef, databaseContextService, arquivoService) {
      const entity =
        await databaseContextService.entrevistaMatchCriterioRepository
          .createQueryBuilder('entrevistaMatchCriterio')
          .leftJoin('entrevistaMatchCriterio.arquivo', 'arquivo')
          .innerJoin('entrevistaMatchCriterio.entrevista', 'entrevista')
          .innerJoin('entrevistaMatchCriterio.criterio', 'criterio')
          .where('entrevistaMatchCriterio.id = :id', { id: entityRef.id })
          .select([
            'entrevistaMatchCriterio',
            'arquivo',
            'criterio',
            'entrevista',
          ])
          .getOne();

      if (!entity.arquivo) {
        return;
      }

      const detected = detectFile(entity.arquivo.accessToken);

      if (!detected) {
        return;
      }

      const buffer = await detected.fetcher();

      const { objectName: newReference } =
        await arquivoService.uploadInterviewCriterionFromBase64(
          null,
          entity.entrevista.id,
          entity.criterio.id,
          buffer.toString('base64'),
          {
            byteString: entity.arquivo.byteString,
            nameSizeFile: entity.arquivo.nameSizeFile,
            nomeArquivo: entity.arquivo.nomeArquivo,
            tipoArquivo: entity.arquivo.tipoArquivo,
          },
        );

      await databaseContextService.arquivoRepository
        .createQueryBuilder()
        .update()
        .set({
          accessToken: newReference,
        })
        .whereInIds([entity.arquivo.id])
        .execute();
    },
  }),
];

async function migrate(
  databaseContextService: DatabaseContextService,
  arquivoService: ArquivoService,
) {
  const generateRows = async function* () {
    for (const updateToPerform of updatesToPerform) {
      const repository = updateToPerform.getRepository(databaseContextService);

      const rows = updateToPerform.getRows(databaseContextService);

      for await (const row of rows) {
        const entity = await repository.findOne({
          where: {
            id: row.id,
          },
        });

        yield {
          entity,
          updateToPerform,
        };
      }
    }
  };

  for await (const { entity, updateToPerform } of generateRows()) {
    try {
      console.debug(
        'migrando',
        entity.id,
        updateToPerform.getRepository(databaseContextService).metadata
          .tableName,
      );

      await updateToPerform.handle(
        entity,
        databaseContextService,
        arquivoService,
      );
      3;

      console.debug('sucesso na migracao');
    } catch (e) {
      console.log('nao foi possivel processar a entidade');
      console.debug(e);

      process.exit();
    }
  }
}

async function main() {
  const app = await NestFactory.create(CustomModule);

  useContainer(app.select(CustomModule), { fallbackOnErrors: true });

  const databaseContextService = app.get(DatabaseContextService);
  const arquivoService = app.get(ArquivoService);

  await migrate(databaseContextService, arquivoService);
}

main();
