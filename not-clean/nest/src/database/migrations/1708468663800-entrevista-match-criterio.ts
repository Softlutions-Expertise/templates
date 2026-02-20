import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Criterios } from '../../modules/entrevista/dto/enums/enum';

export interface RawEntrevista {
  id: string;
  data_entrevista: Date;
  horario_agendamento: string;
  etapa: string;
  preferencia_turno: string;
  tipo_responsavel: string;
  nome_responsavel: string;
  cpf_responsavel: string;
  data_nascimento_responsavel: Date;
  sexo_responsavel: string;
  estado_civil_responsavel: string;
  preferencia_unidade: string;
  preferencia_unidade2: string;
  possui_irmao_na_unidade: boolean;
  nome_irmao: any;
  cpf_irmao: any;
  secretaria_municipal_irmao: any;
  criterios: string;
  membros_edereco_crianca: string;
  membros_contribuintes_renda: string;
  valor_renda_familiar: string;
  observacoes_familia: any;
  observacoes_central_vagas: any;
  created_at: Date;
  updated_at: Date | null;
  crianca_id: string;
  entrevistador: string;
  secretaria_municipal_id: string;
}

export class EntrevistaMatchCriterio1708468663800
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'entrevista_match_criterio',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          {
            name: 'ativo',
            type: 'boolean',
          },

          {
            name: 'versao_mais_recente',
            type: 'boolean',
          },

          {
            name: 'arquivo_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'entrevista_id',
            type: 'uuid',
          },
          {
            name: 'criterio_id',
            type: 'uuid',
          },

          //

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],

        foreignKeys: [
          {
            name: 'Fk__entrevista-match-criterio__arquivo',
            columnNames: ['arquivo_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'arquivo',
          },
          {
            name: 'Fk__entrevista-match-criterio__entrevista',
            columnNames: ['entrevista_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'entrevista',
          },
          {
            name: 'Fk__entrevista-match-criterio__criterio',
            columnNames: ['criterio_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'criterios',
          },
        ],
      }),
    );

    const entrevistas: RawEntrevista[] = await queryRunner.query(
      'SELECT * FROM entrevista;',
    );

    for (const entrevista of entrevistas) {
      const criterios: Criterios[] = JSON.parse(entrevista.criterios);

      for (const criterio of criterios) {
        const matchCriterio = {
          id: uuid(),
          ativo: criterio.ativo,
          versao_mais_recente: true,
          arquivo_id: null,
          entrevista_id: entrevista.id,
          criterio_id: criterio.id,
        };

        if (criterio.arquivo) {
          const arquivoId = uuid();

          await queryRunner.query(
            `
            INSERT INTO arquivo
              (id, access_token, nome_arquivo, tipo_arquivo, name_size_file, byte_string)
            VALUES
              ($1, $2, $3, $4, $5, $6);
            `,
            [
              arquivoId,
              criterio.arquivo ?? null,
              criterio.nomeArquivo ?? null,
              criterio.tipoArquivo ?? null,
              criterio.nameSizeFile ?? null,
              criterio.byteString ?? null,
            ],
          );

          matchCriterio.arquivo_id = arquivoId;
        }

        await queryRunner.query(
          `
          INSERT INTO entrevista_match_criterio
            (id, ativo, versao_mais_recente, arquivo_id, entrevista_id, criterio_id)
          VALUES
            ($1, $2, $3, $4, $5, $6);
          `,
          [
            matchCriterio.id,
            matchCriterio.ativo,
            matchCriterio.versao_mais_recente,
            matchCriterio.arquivo_id,
            matchCriterio.entrevista_id,
            matchCriterio.criterio_id,
          ],
        );
      }
    }

    await queryRunner.query('ALTER TABLE entrevista DROP COLUMN criterios');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('entrevista_match_criterio', true, true, true);
  }
}
