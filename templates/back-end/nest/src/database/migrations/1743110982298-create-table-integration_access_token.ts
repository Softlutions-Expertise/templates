import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableIntegrationAcessToken1743110982298
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'integration_access_token',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          //

          {
            name: 'descricao',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'valido_ate',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'ativo',
            type: 'boolean',
          },

          {
            name: 'id_funcionario_autor_fk',
            type: 'uuid',
            isNullable: false,
          },

          {
            name: 'id_herda_permissoes_de_funcionario_fk',
            type: 'uuid',
            isNullable: true,
          },

          //

          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_funcionario_autor_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'pessoa_funcionario',
          },
          {
            columnNames: ['id_herda_permissoes_de_funcionario_fk'],
            referencedColumnNames: ['id'],
            referencedTableName: 'pessoa_funcionario',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('integration_access_token');
  }
}
