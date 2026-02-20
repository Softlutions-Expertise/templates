import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddValuesForAllDocumentoTable1758903923610
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const escolas = await queryRunner.query(`SELECT id FROM escola`);

    const documentos_padrao = [
      {
        nome: 'Certidão de Nascimento da Criança',
      },
      {
        nome: 'CPF do Responsável',
      },
      {
        nome: 'RG do Responsável',
      },
      {
        nome: 'Comprovante de Residência',
      },
    ];

    for (const escola of escolas) {
      for (const documento of documentos_padrao) {
        await queryRunner.query(
          `INSERT INTO documento (escola_id, nome) 
              VALUES ($1, $2)`,
          [escola.id, documento.nome],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM documento`);
  }
}
