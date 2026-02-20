import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateValuesEtapaIdInEntrevistaTable1726533358797
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE entrevista
      SET etapa_id = CASE
        WHEN etapa = 'Berçário – menores de 2 anos' THEN 1
        WHEN etapa = 'Maternal I – 2 anos a 2 anos e 11 meses' THEN 3
        WHEN etapa = 'Maternal II – 3 anos a 3 anos e 11 meses' THEN 4
        WHEN etapa = 'Pré/Jardim I – 4 anos a 4 anos e 11 meses' THEN 5
        WHEN etapa = 'Pré/Jardim II – 5 anos a 5 anos e 11 meses' THEN 6
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE entrevista
      SET etapa_id = NULL
    `);
  }
}
