import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAtivoToGerenciaAgendamento1694450000000 implements MigrationInterface {
  name = 'AddAtivoToGerenciaAgendamento1694450000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gerencia_agendamento" ADD "ativo" boolean NOT NULL DEFAULT true`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gerencia_agendamento" DROP COLUMN "ativo"`
    );
  }
}
