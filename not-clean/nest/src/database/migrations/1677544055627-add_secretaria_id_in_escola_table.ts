import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addSecretariaIdInEscolaTable1677544055627
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('escola', [
      new TableColumn({
        name: 'secretaria_municipal_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
    await queryRunner.createForeignKeys('escola', [
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('escola');

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
