import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CriterioConfiguracaoNotaTecnica } from '../../modules/configuracao-criterio/entities/criterios-configuracao-criterio.entity';
import {
  CriterioDefinido,
  CriteriosDefinidos,
} from '../../modules/configuracao-criterio/fixtures/CriteriosDefinidos';

export class MigrateCriteriosConfiguracao1708468663660
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const secretarias: { id: string }[] = await queryRunner.query(
      'SELECT id FROM secretaria_municipal;',
    );

    for (const secretaria of secretarias) {
      const secretariaCriterios: {
        id: string;
        grupos_preferenciais: string;
        tipo: string;
        ordem_atendimento_preferencial: number;
        exigir_comprovacao: boolean;
      }[] = await queryRunner.query(
        `SELECT 
          criterio.id, criterio.grupos_preferenciais, criterio.tipo, criterio.ordem_atendimento_preferencial, criterio.exigir_comprovacao 
        FROM criterios criterio 
        INNER JOIN secretaria_municipal sm ON sm.id = criterio.secretaria_municipal_id 
        WHERE sm.id = $1
        ;`,
        [secretaria.id],
      );

      const [configuracao]: { id: string }[] = await queryRunner.query(
        `INSERT INTO criterios_configuracao
          (id, data_vigencia_inicio, data_vigencia_fim, secretaria_municipal_id)
          VALUES
          ($1, $2, $3, $4)
          RETURNING id;
        `,
        [uuid(), new Date(), null, secretaria.id],
      );

      let contadorSubPosicaoC = 0;

      for (const secretariaCriterio of secretariaCriterios) {
        secretariaCriterio.grupos_preferenciais =
          secretariaCriterio.grupos_preferenciais.trim();

        let subPosicao = null;

        let posicao: number;
        let notaTecnica: CriterioConfiguracaoNotaTecnica;

        switch (secretariaCriterio.grupos_preferenciais.trim()) {
          case CriteriosDefinidos[CriterioDefinido.A].label: {
            posicao = 1;
            notaTecnica = CriterioConfiguracaoNotaTecnica.DEFINIDO;
            break;
          }

          case CriteriosDefinidos[CriterioDefinido.B].label: {
            posicao = 2;
            notaTecnica = CriterioConfiguracaoNotaTecnica.DEFINIDO;
            break;
          }

          case CriteriosDefinidos[CriterioDefinido.D].label: {
            posicao = 4;
            notaTecnica = CriterioConfiguracaoNotaTecnica.DEFINIDO;
            break;
          }

          case CriteriosDefinidos[CriterioDefinido.E].label: {
            posicao = 5;
            notaTecnica = CriterioConfiguracaoNotaTecnica.DEFINIDO;
            break;
          }

          case CriteriosDefinidos[CriterioDefinido.F].label: {
            posicao = 6;
            notaTecnica = CriterioConfiguracaoNotaTecnica.DEFINIDO;
            break;
          }

          default: {
            posicao = 3;
            subPosicao = ++contadorSubPosicaoC;
            notaTecnica = CriterioConfiguracaoNotaTecnica.TIPO_C;
          }
        }

        await queryRunner.query(
          `INSERT INTO criterios_configuracao_criterio
            (id, nota_tecnica, posicao, sub_posicao, exigir_comprovacao, criterio_id, criterios_configuracao_id)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
          `,
          [
            uuid(),
            notaTecnica, // nota_tecnica
            posicao, // posicao
            subPosicao, // sub posicao
            secretariaCriterio.exigir_comprovacao,
            secretariaCriterio.id,
            configuracao.id,
          ],
        );
      }
    }

    await queryRunner.query('ALTER TABLE criterios ADD COLUMN nome text');

    await queryRunner.query(
      'UPDATE criterios SET nome = grupos_preferenciais;',
    );

    await queryRunner.query(
      'ALTER TABLE criterios DROP COLUMN grupos_preferenciais;',
    );

    await queryRunner.query('ALTER TABLE criterios DROP COLUMN tipo;');

    await queryRunner.query(
      'ALTER TABLE criterios DROP COLUMN ordem_atendimento_preferencial;',
    );

    await queryRunner.query(
      'ALTER TABLE criterios DROP COLUMN exigir_comprovacao;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM criterios_configuracao;');
    await queryRunner.query('DELETE FROM criterios_configuracao_criterio;');
  }
}
