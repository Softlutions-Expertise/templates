import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDiasNaoUteisTable1733423218692
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dias_nao_uteis',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'data_feriado',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'titulo_feriado',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'gerencia_agendamento_id',
            type: 'uuid',
            isNullable: false,
          },
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
              columnNames: ['gerencia_agendamento_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'gerencia_agendamento',
            },
          ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dias_nao_uteis');
  }
}
