import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class GerenciaAgendamentos1693268312891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'gerencia_agendamento',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'intervalo_entrevista',
            type: 'varchar',
          },
          {
            name: 'numero_atendimento_intervalo',
            type: 'int',
          },
          {
            name: 'horario_inicio_matutino',
            type: 'varchar',
          },
          {
            name: 'horario_fim_matutino',
            type: 'varchar',
          },
          {
            name: 'horario_inicio_vespertino',
            type: 'varchar',
          },
          {
            name: 'horario_fim_vespertino',
            type: 'varchar',
          },
          {
            name: 'secretaria_municipal_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'gerencia_agendamento',
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('gerencia_agendamento');
    const table = await queryRunner.getTable('secretaria_municipal');

    if (table) {
      const foreignColumns = ['secretaria_municipal_id'];

      for (const foreignColumnName of foreignColumns) {
        const column = table.findColumnByName(foreignColumnName);
        if (column) {
          await queryRunner.dropForeignKeys(
            table,
            table.findColumnForeignKeys(column),
          );
          await queryRunner.dropColumn(table, column);
        }
      }
    }
  }
}
