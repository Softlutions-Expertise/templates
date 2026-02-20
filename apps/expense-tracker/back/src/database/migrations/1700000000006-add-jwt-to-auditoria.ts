import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJwtToAuditoria1700000000006 implements MigrationInterface {
  name = 'AddJwtToAuditoria1700000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE auditorias 
      ADD COLUMN jwt_token text;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE auditorias 
      DROP COLUMN jwt_token;
    `);
  }
}
