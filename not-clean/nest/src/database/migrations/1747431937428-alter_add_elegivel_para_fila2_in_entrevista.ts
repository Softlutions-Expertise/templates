import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAddElegivelParaFila2InEntrevista1747431937428
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE entrevista ADD COLUMN elegivel_para_fila2 BOOLEAN DEFAULT TRUE;`,
    );

    await queryRunner.query(
      `UPDATE entrevista SET elegivel_para_fila2 = elegivel_para_fila;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE entrevista DROP COLUMN elegivel_para_fila2;`,
    );
  }
}
