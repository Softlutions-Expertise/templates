import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEtapaInEntrevista2Table1727483830111
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Não será mais feito o retry em produção e para não ter que apagar a migration
    // e quebrar o ambiente development e stage, estou apenas deixando a migration com
    // um código "nulo" de forma que também passe pelo sonar

    await queryRunner.query(`
      SELECT * FROM entrevista WHERE id IS NULL LIMIT 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SELECT * FROM entrevista WHERE id IS NULL LIMIT 10
    `);
  }
}
