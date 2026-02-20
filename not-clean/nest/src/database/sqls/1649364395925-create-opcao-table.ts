import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOpcaoTable1649364395925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'escola_opcao',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'categoria_id',
            type: 'int',
          },
          {
            name: 'descricao',
            type: 'varchar',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'escola_opcao',
      new TableForeignKey({
        columnNames: ['categoria_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola_opcao_categoria',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('escola_opcao');
    if (table) {
      const foreignKey = table.findColumnByName('categoria_id');
      if (foreignKey) {
        await queryRunner.dropForeignKeys(
          'escola_opcao',
          table.findColumnForeignKeys(foreignKey),
        );
        await queryRunner.dropColumn('escola_opcao', foreignKey);
      }
      await queryRunner.dropTable('escola_opcao');
    }
  }
}
