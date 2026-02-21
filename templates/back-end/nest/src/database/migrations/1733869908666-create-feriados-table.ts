import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeriadosTable1733869908666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'feriado',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          {
            name: 'data',
            type: 'date',
            isNullable: false,
          },

          {
            name: 'titulo',
            type: 'text',
            isNullable: false,
          },

          //

          {
            name: 'id_estado_fk',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'id_cidade_fk',
            type: 'int',
            isNullable: true,
          },

          //

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_estado_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'estado',
          },
          {
            columnNames: ['id_cidade_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cidade',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feriado');
  }
}
