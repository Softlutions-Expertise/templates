import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateConsultaFeriadosTable1733870155023
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'consulta_feriados',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          {
            name: 'ano',
            type: 'smallint',
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
    await queryRunner.dropTable('consulta_feriados');
  }
}
