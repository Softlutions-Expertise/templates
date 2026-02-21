import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEtapaNullableInTurmaTable1726790223192
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE turma
          ALTER COLUMN etapa DROP NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE turma
          ALTER COLUMN etapa SET NOT NULL;
        `);
  }
}   
