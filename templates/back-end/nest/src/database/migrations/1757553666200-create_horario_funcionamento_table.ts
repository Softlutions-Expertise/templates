import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateHorarioFuncionamentoTable1757553666200
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'horario_funcionamento',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'dia_semana',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'inicio_manha',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'fim_manha',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'inicio_tarde',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'fim_tarde',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'escola_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'horario_funcionamento',
      new TableForeignKey({
        columnNames: ['escola_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('horario_funcionamento');
  }
}
