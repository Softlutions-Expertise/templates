import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixIdadeInSecretariaMunicipalEtapaTable1725939155541
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE secretaria_municipal_etapa
        SET idade_inicial = CASE 
            WHEN idade_inicial = 0 THEN 0.00
            WHEN idade_inicial = 0.6 THEN 0.06
            WHEN idade_inicial = 0.7 THEN 0.07
            WHEN idade_inicial = 1.6 THEN 1.06
            WHEN idade_inicial = 1.7 THEN 1.07
            WHEN idade_inicial = 3 THEN 3.00
            WHEN idade_inicial = 4 THEN 4.00
            WHEN idade_inicial = 5 THEN 5.00
            ELSE idade_inicial
        END,
        idade_final = CASE 
            WHEN idade_final = 0 THEN 0.00
            WHEN idade_final = 0.6 THEN 0.06
            WHEN idade_final = 0.7 THEN 0.07
            WHEN idade_final = 1.6 THEN 1.06
            WHEN idade_final = 1.7 THEN 1.07
            WHEN idade_final = 3 THEN 3.00
            WHEN idade_final = 4 THEN 4.00
            WHEN idade_final = 5 THEN 5.00
            ELSE idade_final
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE secretaria_municipal_etapa
        SET idade_inicial = CASE 
            WHEN idade_inicial = 0.00 THEN 0
            WHEN idade_inicial = 0.06 THEN 0.6
            WHEN idade_inicial = 0.07 THEN 0.7
            WHEN idade_inicial = 1.06 THEN 1.6
            WHEN idade_inicial = 1.07 THEN 1.7
            WHEN idade_inicial = 3.00 THEN 3
            WHEN idade_inicial = 4.00 THEN 4
            WHEN idade_inicial = 5.00 THEN 5
            ELSE idade_inicial
        END,
        idade_final = CASE 
            WHEN idade_final = 0.00 THEN 0
            WHEN idade_final = 0.06 THEN 0.6
            WHEN idade_final = 0.07 THEN 0.7
            WHEN idade_final = 1.06 THEN 1.6
            WHEN idade_final = 1.07 THEN 1.7
            WHEN idade_final = 3.00 THEN 3
            WHEN idade_final = 4.00 THEN 4
            WHEN idade_final = 5.00 THEN 5
            ELSE idade_final
        END
    `);
  }
}
