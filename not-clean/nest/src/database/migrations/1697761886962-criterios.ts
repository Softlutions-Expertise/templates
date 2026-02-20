import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Criterios1697761886962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'criterios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'grupos_preferenciais',
            type: 'varchar',
          },
          {
            name: 'tipo',
            type: 'varchar',
          },
          {
            name: 'ordem_atendimento_preferencial',
            type: 'int',
            isUnique: false,
          },
          {
            name: 'exigir_comprovacao',
            type: 'bool',
          },
        ],
      }),
    );

    await queryRunner.addColumns('criterios', [
      new TableColumn({
        name: 'secretaria_municipal_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('criterios', [
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('criterios');
    await queryRunner.dropColumn('secretaria_municipal', 'criterios_id');
  }
}
