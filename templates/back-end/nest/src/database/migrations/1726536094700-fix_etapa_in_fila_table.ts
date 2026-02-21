import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class FixEtapaInFilaTable1726536094700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'fila',
      new TableColumn({
        name: 'etapa_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'fila',
      new TableForeignKey({
        columnNames: ['etapa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'etapa',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('fila');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('etapa_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('fila', foreignKey);
      }
    }

    await queryRunner.dropColumn('fila', 'etapa_id');
  }
}
