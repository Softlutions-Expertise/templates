import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class FixEtapaInEntrevistaTable1726532895534
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'entrevista',
      new TableColumn({
        name: 'etapa_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'entrevista',
      new TableForeignKey({
        columnNames: ['etapa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'etapa',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('entrevista');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('etapa_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('entrevista', foreignKey);
      }
    }

    await queryRunner.dropColumn('entrevista', 'etapa_id');
  }
}
