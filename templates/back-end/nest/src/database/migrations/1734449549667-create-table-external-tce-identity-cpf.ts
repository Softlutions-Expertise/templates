import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableExternalTceIdentityCpf1734449549667
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'external_tce_identity_cpf',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },

          {
            name: 'sub',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'cpf',
            type: 'text',
            isNullable: false,
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
        foreignKeys: [],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('external_tce_identity_cpf');
  }
}
