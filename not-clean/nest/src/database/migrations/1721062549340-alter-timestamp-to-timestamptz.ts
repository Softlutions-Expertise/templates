import { MigrationInterface, QueryRunner } from 'typeorm';

const tablesReferencesToPatch = [
  {
    tableName: 'pessoa',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'base_endereco',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'base_contato',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'secretaria_municipal',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'usuario',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'gerencia_agendamento',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'agendamento',
    columns: ['data_nascimento', 'data', 'created_at', 'updated_at'],
  },
  {
    tableName: 'crianca',
    columns: ['data_nascimento', 'created_at', 'updated_at'],
  },
  {
    tableName: 'entrevista',
    columns: [
      'data_entrevista',
      'data_nascimento_responsavel',
      'created_at',
      'updated_at',
    ],
  },
  {
    tableName: 'turma',
    columns: ['periodo_inicial', 'periodo_final', 'created_at', 'updated_at'],
  },
  {
    tableName: 'registrar_contato',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'vagas',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'registro_vagas',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'criterios_configuracao',
    columns: ['data_vigencia_inicio', 'data_vigencia_fim'],
  },
  {
    tableName: 'entrevista_match_criterio',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'criterios',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'reserva_vaga',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'reserva_vaga',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'fila',
    columns: ['created_at', 'updated_at', 'deleted_at'],
  },
  {
    tableName: 'fila_gerada_posicao',
    columns: ['created_at', 'updated_at'],
  },
  {
    tableName: 'codigo_reserva_vaga',
    columns: ['created_at', 'updated_at'],
  },
];

export class AlterTimestampToTimestamptz1721062549340
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { tableName, columns } of tablesReferencesToPatch) {
      const table = await queryRunner.getTable(tableName);

      if (!table) {
        throw new TypeError(`Table not found: ${tableName}`);
      }

      for (const columnName of columns) {
        const column = table.columns.find(
          (column) => column.name === columnName,
        );

        if (!column) {
          throw new TypeError(
            `Column "${columnName}" not found in table "${tableName}"`,
          );
        }

        await queryRunner.query(
          `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE timestamptz USING ${columnName}::timestamptz`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { tableName, columns } of tablesReferencesToPatch) {
      const table = await queryRunner.getTable(tableName);

      if (!table) {
        throw new TypeError(`Table not found: ${tableName}`);
      }

      for (const columnName of columns) {
        const column = table.columns.find(
          (column) => column.name === columnName,
        );

        if (!column) {
          throw new TypeError(
            `Column "${columnName}" not found in table "${tableName}"`,
          );
        }

        await queryRunner.query(
          `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE timestamp USING ${columnName}::timestamp`,
        );
      }
    }
  }
}
