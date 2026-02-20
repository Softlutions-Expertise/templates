import { MigrationInterface, QueryRunner } from 'typeorm';
import { DiaSemanaEnum } from '../../modules/horario-funcionamento/enums/dias-semana.enum';

export class AddValuesForAllEscolasInHorarioFuncionamentoTable1757558946720
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const escolas = await queryRunner.query(`SELECT id FROM escola`);

    const horarios_funcionamento_padrao = [
      {
        diaSemana: DiaSemanaEnum.SEGUNDA,
        ativo: true,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
      {
        diaSemana: DiaSemanaEnum.TERCA,
        ativo: true,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
      {
        diaSemana: DiaSemanaEnum.QUARTA,
        ativo: true,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
      {
        diaSemana: DiaSemanaEnum.QUINTA,
        ativo: true,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
      {
        diaSemana: DiaSemanaEnum.SEXTA,
        ativo: true,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
      {
        diaSemana: DiaSemanaEnum.SABADO,
        ativo: false,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
      {
        diaSemana: DiaSemanaEnum.DOMINGO,
        ativo: false,
        inicioManha: '08:00',
        fimManha: '12:00',
        inicioTarde: '14:00',
        fimTarde: '18:00',
      },
    ];

    for (const escola of escolas) {
      for (const horario of horarios_funcionamento_padrao) {
        await queryRunner.query(
          `INSERT INTO horario_funcionamento (escola_id, dia_semana, ativo, inicio_manha, fim_manha, inicio_tarde, fim_tarde) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            escola.id,
            horario.diaSemana,
            horario.ativo,
            horario.inicioManha,
            horario.fimManha,
            horario.inicioTarde,
            horario.fimTarde,
          ],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM horario_funcionamento`);
  }
}
