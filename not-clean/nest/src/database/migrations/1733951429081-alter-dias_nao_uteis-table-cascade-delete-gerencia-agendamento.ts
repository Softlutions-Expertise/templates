import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterDiasNaoUteisTableCascadeDeleteGerenciaAgendamento1733951429081
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('dias_nao_uteis');

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('gerencia_agendamento_id') !== -1,
    );

    await queryRunner.dropForeignKey('dias_nao_uteis', foreignKey);

    await queryRunner.createForeignKey(
      'dias_nao_uteis',
      new TableForeignKey({
        columnNames: ['gerencia_agendamento_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'gerencia_agendamento',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'fk__dias_nao_uteis__gerencia_agendamento_id',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('dias_nao_uteis');

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('gerencia_agendamento_id') !== -1,
    );

    await queryRunner.dropForeignKey('dias_nao_uteis', foreignKey);

    await queryRunner.createForeignKey(
      'dias_nao_uteis',
      new TableForeignKey({
        columnNames: ['gerencia_agendamento_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'gerencia_agendamento',
      }),
    );
  }
}
