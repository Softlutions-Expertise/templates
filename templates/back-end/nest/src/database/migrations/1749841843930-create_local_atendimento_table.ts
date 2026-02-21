import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLocalAtendimentoTable1749841843930
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'local_atendimento',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
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
            name: 'secretaria_municipal_id',
            type: 'uuid',
            isNullable: false,
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
          {
            columnNames: ['secretaria_municipal_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'secretaria_municipal',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('local_atendimento');
  }
}
