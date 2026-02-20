import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Turma1698518772523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'turma',
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
          },
          {
            name: 'etapa',
            type: 'varchar',
          },
          {
            name: 'turno',
            type: 'varchar',
          },
          {
            name: 'periodo_inicial',
            type: 'timestamp',
          },
          {
            name: 'periodo_final',
            type: 'timestamp',
          },
          {
            name: 'horario_inicial',
            type: 'varchar',
          },
          {
            name: 'horario_final',
            type: 'varchar',
          },
          {
            name: 'dias_semana',
            type: 'text',
          },
          {
            name: 'tipo_turma',
            type: 'varchar',
          },
          {
            name: 'situacao',
            type: 'boolean',
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
            columnNames: ['escola_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'escola',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('turma');
  }
}
