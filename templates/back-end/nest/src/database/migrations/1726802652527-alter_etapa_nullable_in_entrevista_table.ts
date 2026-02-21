import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEtapaNullableInEntrevistaTable1726802652527
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE entrevista
        ALTER COLUMN etapa DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE entrevista
        ALTER COLUMN etapa SET NOT NULL;
    `);
  }
}
