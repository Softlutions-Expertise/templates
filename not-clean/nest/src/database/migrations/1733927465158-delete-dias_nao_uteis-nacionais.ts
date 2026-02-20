import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteDiasNaoUteisNacionais1733927465158
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM dias_nao_uteis WHERE gerencia_agendamento_id IS NULL;`,
    );
  }

  public async down(): Promise<void> {
    /**
     * Não tem como recuperar os dados
     * O DiasUteisSyncService pode ser ajustado para puxar os dias_nao_uteis nacionais (com gerencia_agendamento_id NULL)
     */
  }
}
