import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEtapasEnsinoFundamentalInEtapaTable1756428984659
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO etapa (id, nome, created_at) VALUES
      (7, '1º ano', NOW()),
      (8, '2º ano', NOW()),
      (9, '3º ano', NOW()),
      (10, '4º ano', NOW()),
      (11, '5º ano', NOW());
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM etapa WHERE id IN (7, 8, 9, 10, 11);
    `);
  }
}
