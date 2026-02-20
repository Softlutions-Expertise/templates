import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEntrevistaColumnsDataTypes1747611884355
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entrevista 
      ADD COLUMN membros_edereco_crianca_int INTEGER,
      ADD COLUMN membros_contribuintes_renda_int INTEGER,
      ADD COLUMN valor_renda_familiar_decimal DECIMAL(10,2)
    `);

    await queryRunner.query(`
      UPDATE entrevista 
      SET membros_edereco_crianca_int = 
          CASE 
            WHEN membros_edereco_crianca ~ '^[0-9]+$' 
            THEN CAST(membros_edereco_crianca AS INTEGER) 
            ELSE 0 
          END
    `);

    await queryRunner.query(`
      UPDATE entrevista 
      SET membros_contribuintes_renda_int = 
          CASE 
            WHEN membros_contribuintes_renda ~ '^[0-9]+$' 
            THEN CAST(membros_contribuintes_renda AS INTEGER) 
            ELSE 0 
          END
    `);

    await queryRunner.query(`
      UPDATE entrevista 
      SET valor_renda_familiar_decimal = 
          CAST(
            COALESCE(
              NULLIF(
                TRIM(
                  REGEXP_REPLACE(
                    REGEXP_REPLACE(
                      COALESCE(valor_renda_familiar, '0'), 
                      '[^0-9]', '', 'g'
                    ),
                    '(\\d{1,3})(\\d{2})$', '\\1.\\2'
                  )
                ),
                ''
              ),
              '0'
            ) AS DECIMAL
          )
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      DROP COLUMN membros_edereco_crianca
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      DROP COLUMN membros_contribuintes_renda
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      DROP COLUMN valor_renda_familiar
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      RENAME COLUMN membros_edereco_crianca_int TO membros_edereco_crianca
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      RENAME COLUMN membros_contribuintes_renda_int TO membros_contribuintes_renda
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      RENAME COLUMN valor_renda_familiar_decimal TO valor_renda_familiar
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE entrevista 
      ADD COLUMN membros_edereco_crianca_text VARCHAR,
      ADD COLUMN membros_contribuintes_renda_text VARCHAR,
      ADD COLUMN valor_renda_familiar_text VARCHAR
    `);

    await queryRunner.query(`
      UPDATE entrevista 
      SET membros_edereco_crianca_text = CAST(membros_edereco_crianca AS VARCHAR)
    `);

    await queryRunner.query(`
      UPDATE entrevista 
      SET membros_contribuintes_renda_text = CAST(membros_contribuintes_renda AS VARCHAR)
    `);

    await queryRunner.query(`
      UPDATE entrevista 
      SET valor_renda_familiar_text = CAST(valor_renda_familiar AS VARCHAR)
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      DROP COLUMN membros_edereco_crianca
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      DROP COLUMN membros_contribuintes_renda
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      DROP COLUMN valor_renda_familiar
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      RENAME COLUMN membros_edereco_crianca_text TO membros_edereco_crianca
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      RENAME COLUMN membros_contribuintes_renda_text TO membros_contribuintes_renda
    `);

    await queryRunner.query(`
      ALTER TABLE entrevista 
      RENAME COLUMN valor_renda_familiar_text TO valor_renda_familiar
    `);
  }
}
