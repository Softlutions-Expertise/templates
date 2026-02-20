import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterEscolaTable1667430681377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('escola', [
      new TableColumn({
        name: 'contato_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'endereco_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('escola', [
      new TableForeignKey({
        columnNames: ['endereco_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_endereco',
      }),
      new TableForeignKey({
        columnNames: ['contato_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_contato',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('escola');

    if (table) {
      const foreignColumns = [
        'infraestrutura_id',
        'equipamento_id',
        'recurso_humano_id',
        `alimentacao_escolar_id`,
        `organizacao_id`,
        `endereco_id`,
        `contato_id`,
      ];

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
