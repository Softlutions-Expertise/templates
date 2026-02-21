import { MigrationInterface, QueryRunner } from 'typeorm';

export class HelperGetCurrentCriteriosConfiguracaoCriterioWithNow1720694703440
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION get_current_configuracao_criterio_id_by_criterio_id_with_now(criterioId uuid, fNow timestamptz)
    RETURNS uuid AS
    $$
    declare id uuid;
    BEGIN

        SELECT
            criterios_configuracao_criterio.id INTO id
            FROM criterios_configuracao_criterio
            INNER JOIN criterios criterio ON criterio.id = criterios_configuracao_criterio.criterio_id
            INNER JOIN criterios_configuracao ON criterios_configuracao.id = criterios_configuracao_criterio.criterios_configuracao_id

            WHERE (
                criterio.id = criterioId
                AND
                (
                    (criterios_configuracao.data_vigencia_inicio <= fNow)
                    AND
                    (
                        (criterios_configuracao.data_vigencia_fim IS NULL)
                        OR
                        (criterios_configuracao.data_vigencia_fim > fNow)
                    )
                )
          )
          ORDER BY criterios_configuracao.data_vigencia_inicio DESC
          LIMIT 1
        ;

        RETURN id;
    END;
    $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `drop function if exists get_current_configuracao_criterio_id_by_criterio_id_with_now;`,
    );
  }
}
