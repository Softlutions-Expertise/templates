import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriteriosConfiguracao1708468663652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'criterios_configuracao',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'data_vigencia_inicio',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'data_vigencia_fim',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'secretaria_municipal_id',
            type: 'uuid',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'Fk__criterios_configuracao__secretaria_municipal_id',
            columnNames: ['secretaria_municipal_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'secretaria_municipal',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'criterios_configuracao_criterio',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nota_tecnica',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'posicao',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sub_posicao',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'exigir_comprovacao',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'criterio_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'criterios_configuracao_id',
            type: 'uuid',
            isNullable: false,
          },
        ],

        foreignKeys: [
          {
            name: 'Fk__criterios_configuracao_criterio__criterio_id',
            columnNames: ['criterio_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'criterios',
          },
          {
            name: 'Fk__criterios_configuracao_criterio__criterios_configuracao_id',
            columnNames: ['criterios_configuracao_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'criterios_configuracao',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('criterios_configuracao_criterio', true);
    await queryRunner.dropTable('criterios_configuracao', true);
  }
}
