import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCidadeTable1629832895512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cidade',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'estado_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'cidade',
      new TableForeignKey({
        columnNames: ['estado_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'estado',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cidade');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('estado_id') !== -1,
    );
    await queryRunner.dropForeignKey('cidade', foreignKey || '');
    await queryRunner.dropColumn('cidade', 'estado_id');
    await queryRunner.dropTable('cidade');
  }
}
