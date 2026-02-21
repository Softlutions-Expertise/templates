import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AddEtapasEnsinoFundamentalInEtapaTable1756429932486
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const secretarias = await queryRunner.query(
      `SELECT id, data_limite FROM secretaria_municipal`,
    );

    const etapas = [
      {
        id: 7,
        idade_inicial: 6,
        idade_final: 6.11,
        apelido: '1º ano'
      }, // 1º ano
      {
        id: 8,
        idade_inicial: 7,
        idade_final: 7.11,
        apelido: '2º ano'
      }, // 2º ano
      {
        id: 9,
        idade_inicial: 8,
        idade_final: 8.11,
        apelido: '3º ano'
      }, // 3º ano
      {
        id: 10,
        idade_inicial: 9,
        idade_final: 9.11,
        apelido: '4º ano'
      }, // 4º ano
      {
        id: 11,
        idade_inicial: 10,
        idade_final: 10.11,
        apelido: '5º ano'
      }, // 5º ano
    ];

    for (const secretaria of secretarias) {
      for (const etapa of etapas) {
        const id = uuidv4();
        await queryRunner.query(
          `INSERT INTO secretaria_municipal_etapa (id, idade_inicial, idade_final, ativa, apelido, secretaria_municipal_id, etapa_id, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            id,
            etapa.idade_inicial,
            etapa.idade_final,
            false,
            etapa.apelido,
            secretaria.id,
            etapa.id,
          ],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM secretaria_municipal_etapa WHERE etapa_id IN (7, 8, 9, 10, 11)`,
    );
  }
}
