import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RegistrarVaga1701568349677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'registro_vagas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'data_hora_vaga',
            type: 'varchar',
          },
          {
            name: 'servidor_id',
            type: 'uuid',
          },
          {
            name: 'ano_letivo',
            type: 'varchar',
          },
          {
            name: 'escola_id',
            type: 'uuid',
          },
          {
            name: 'turma_id',
            type: 'uuid',
          },
          {
            name: 'quantidade_vagas',
            type: 'int',
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
            columnNames: ['servidor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'pessoa_funcionario',
          },
          {
            columnNames: ['escola_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'escola',
          },
          {
            columnNames: ['turma_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'turma',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('registro_vagas');
  }
}
