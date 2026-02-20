import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterPessoaTableAddRelations1637245287496
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'pessoa',
      new TableColumn({
        name: 'endereco_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'pessoa',
      new TableForeignKey({
        columnNames: ['endereco_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_endereco',
      }),
    );

    await queryRunner.addColumn(
      'pessoa',
      new TableColumn({
        name: 'contato_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'pessoa',
      new TableForeignKey({
        columnNames: ['contato_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_contato',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('pessoa');

    if (table) {
      const foreignColumns = ['endereco_id', 'contato_id'];

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
