import {
  MigrationInterface,
  QueryRunner,
  TableColumn
} from 'typeorm';

export class AlterTableGerenciaAgendamentoDisponibilidadeDiasSemana1709902057668
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('gerencia_agendamento', [
      new TableColumn({
        name: 'disponibilidade_domingo',
        type: 'boolean',
        default: 'FALSE',
      }),
      new TableColumn({
        name: 'disponibilidade_segunda',
        type: 'boolean',
        default: 'TRUE',
      }),
      new TableColumn({
        name: 'disponibilidade_terca',
        type: 'boolean',
        default: 'TRUE',
      }),
      new TableColumn({
        name: 'disponibilidade_quarta',
        type: 'boolean',
        default: 'TRUE',
      }),
      new TableColumn({
        name: 'disponibilidade_quinta',
        type: 'boolean',
        default: 'TRUE',
      }),
      new TableColumn({
        name: 'disponibilidade_sexta',
        type: 'boolean',
        default: 'TRUE',
      }),
      new TableColumn({
        name: 'disponibilidade_sabado',
        type: 'boolean',
        default: 'FALSE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('gerencia_agendamento', [
      'disponibilidade_domingo',
      'disponibilidade_segunda',
      'disponibilidade_terca',
      'disponibilidade_quarta',
      'disponibilidade_quinta',
      'disponibilidade_sexta',
      'disponibilidade_sabado',
    ]);
  }
}
