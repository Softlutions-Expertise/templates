import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateLocalAtendimentoTable1749841891866
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const secretarias = await queryRunner.query(`
      SELECT 
        sm.id as secretaria_id,
        sm."nome_fantasia" as nome_fantasia,
        e.id as endereco_id,
        e.logradouro, e.numero, e.bairro, e.complemento, e."ponto_referencia", e.cep,
        e."localizacao_diferenciada", e.zona, e."cidade_id", e."distrito_id", e."subdistrito_id",
        e.latitude, e.longitude,
        c.id as contato_id,
        c.telefones, c.emails
      FROM secretaria_municipal sm
      LEFT JOIN base_endereco e ON sm."endereco_id" = e.id
      LEFT JOIN base_contato c ON sm."contato_id" = c.id
    `);

    for (const secretaria of secretarias) {
      let enderecoId = null;
      let contatoId = null;

      if (secretaria.endereco_id) {
        const [newEndereco] = await queryRunner.query(
          `
            INSERT INTO base_endereco (
              id, logradouro, numero, bairro, complemento, "ponto_referencia", cep,
              "localizacao_diferenciada", zona, "cidade_id", "distrito_id", "subdistrito_id",
              latitude, longitude, "created_at", "updated_at"
            ) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now(), now())
            RETURNING id
          `,
          [
            secretaria.logradouro,
            secretaria.numero,
            secretaria.bairro,
            secretaria.complemento,
            secretaria.ponto_referencia,
            secretaria.cep,
            secretaria.localizacao_diferenciada,
            secretaria.zona,
            secretaria.cidade_id,
            secretaria.distrito_id,
            secretaria.subdistrito_id,
            secretaria.latitude,
            secretaria.longitude,
          ],
        );
        enderecoId = newEndereco.id;
      }

      if (secretaria.contato_id) {
        const [newContato] = await queryRunner.query(
          `
            INSERT INTO base_contato (id, telefones, emails)
            VALUES (uuid_generate_v4(), $1, $2)
            RETURNING id
          `,
          [secretaria.telefones, secretaria.emails],
        );
        contatoId = newContato.id;
      }

      await queryRunner.query(
        `
          INSERT INTO local_atendimento (
            id, nome, ativo, "endereco_id", "contato_id", "secretaria_municipal_id",
            "created_at", "updated_at"
          ) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, now(), now())
        `,
        [
          `Local de Atendimento - ${secretaria.nome_fantasia}`,
          true,
          enderecoId,
          contatoId,
          secretaria.secretaria_id,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const locaisAtendimentos = await queryRunner.query(`
      SELECT "endereco_id", "contato_id" FROM local_atendimento
      WHERE "endereco_id" IS NOT NULL OR "contato_id" IS NOT NULL
    `);

    await queryRunner.query(`DELETE FROM local_atendimento`);

    for (const local of locaisAtendimentos) {
      if (local.endereco_id) {
        await queryRunner.query(`DELETE FROM base_endereco WHERE id = $1`, [
          local.endereco_id,
        ]);
      }
      if (local.contato_id) {
        await queryRunner.query(`DELETE FROM base_contato WHERE id = $1`, [
          local.contato_id,
        ]);
      }
    }
  }
}
