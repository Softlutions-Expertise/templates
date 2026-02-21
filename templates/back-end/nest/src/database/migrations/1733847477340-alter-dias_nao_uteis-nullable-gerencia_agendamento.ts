import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDiasNaoUteisNullableGerenciaAgendamento1733847477340
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE dias_nao_uteis ALTER COLUMN gerencia_agendamento_id DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM dias_nao_uteis WHERE gerencia_agendamento_id IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE dias_nao_uteis ALTER COLUMN gerencia_agendamento_id SET NOT NULL`,
    );
  }
}
