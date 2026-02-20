import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterResponsavelTable1716521569607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE responsavel RENAME COLUMN registro_nascional_estrangeiro_res TO registro_nacional_estrangeiro_res`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE responsavel RENAME COLUMN registro_nacional_estrangeiro_res TO registro_nascional_estrangeiro_res`,
    );
  }
}
