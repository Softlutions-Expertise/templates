import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Vaga1701648601075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vagas',
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
            name: 'ativa',
            type: 'boolean',
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
          {
            name: 'registro_vagas_id',
            type: 'uuid',
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
          {
            columnNames: ['registro_vagas_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'registro_vagas',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vagas');
  }
}
