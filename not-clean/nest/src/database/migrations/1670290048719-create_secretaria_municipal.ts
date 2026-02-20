import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSecretariaMunicipal1670290048719
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'secretaria_municipal',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'cnpj',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'razao_social',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'natureza_juridica',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'data_criacao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'decreto',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'secretario',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'vinc_ente_federativo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'prefeito',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'endereco_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'contato_id',
            type: 'uuid',
            isNullable: true,
          },
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
            columnNames: ['endereco_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'base_endereco',
          },
          {
            columnNames: ['contato_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'base_contato',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('secretaria_municipal');
  }
}
