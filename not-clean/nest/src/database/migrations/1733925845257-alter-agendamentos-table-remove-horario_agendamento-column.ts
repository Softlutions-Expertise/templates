import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAgendamentosTableRemoveHorarioAgendamentoColumn1733925845257
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('agendamento', 'horario_agendamento');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'agendamento',
      new TableColumn({
        name: 'horario_agendamento',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE agendamento SET horario_agendamento = horario;`,
    );
  }
}
