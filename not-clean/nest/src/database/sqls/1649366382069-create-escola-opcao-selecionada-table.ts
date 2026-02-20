import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEscolaOpcaoSelecionadaTable1649366382069
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'escola_opcao_selecionada',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'escola_id',
            type: 'varchar',
          },
          {
            name: 'opcao_id',
            type: 'int',
          },
          {
            name: 'valor',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'escola_opcao_selecionada',
      new TableForeignKey({
        columnNames: ['escola_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola',
      }),
    );

    await queryRunner.createForeignKey(
      'escola_opcao_selecionada',
      new TableForeignKey({
        columnNames: ['opcao_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola_opcao',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('escola_opcao_selecionada');
    if (table) {
      let foreignKey = table.findColumnByName('escola_id');
      if (foreignKey) {
        await queryRunner.dropForeignKeys(
          'escola_opcao_selecionada',
          table.findColumnForeignKeys(foreignKey),
        );
        await queryRunner.dropColumn('escola_opcao_selecionada', foreignKey);
      }

      foreignKey = table.findColumnByName('opcao_id');
      if (foreignKey) {
        await queryRunner.dropForeignKeys(
          'escola_opcao_selecionada',
          table.findColumnForeignKeys(foreignKey),
        );
        await queryRunner.dropColumn('escola_opcao_selecionada', foreignKey);
      }

      await queryRunner.dropTable('escola_opcao_selecionada');
    }
  }
}
