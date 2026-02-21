import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RegistrarContato1701540702337 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'registrar_contato',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'cpf_crianca',
            type: 'varchar',
          },
          {
            name: 'data_contato',
            type: 'varchar',
          },
          {
            name: 'tipo_contato',
            type: 'varchar',
          },
          {
            name: 'nome_contato',
            type: 'varchar',
          },
          {
            name: 'ligacao_aceita',
            type: 'varchar',
          },
          {
            name: 'observacao',
            type: 'text',
          },
          {
            name: 'entrevista_id',
            type: 'uuid',
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
            columnNames: ['entrevista_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'entrevista',
          },
          {
            columnNames: ['cpf_crianca'],
            referencedColumnNames: ['cpf'],
            referencedTableName: 'crianca',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('registro_contato');
  }
}
