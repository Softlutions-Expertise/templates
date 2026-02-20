import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Arquivo1708468663700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'arquivo',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          {
            name: 'access_token',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'nome_arquivo',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tipo_arquivo',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'name_size_file',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'byte_string',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('arquivo', true, true, true);
  }
}
