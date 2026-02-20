import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class FixEtapaInTurmaTable1726013358224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'turma',
      new TableColumn({
        name: 'etapa_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'turma',
      new TableForeignKey({
        columnNames: ['etapa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'etapa',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('turma');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('etapa_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('turma', foreignKey);
      }
    }

    await queryRunner.dropColumn('turma', 'etapa_id');
  }
}
