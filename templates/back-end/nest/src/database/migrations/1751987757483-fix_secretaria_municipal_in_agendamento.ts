import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSecretariaMunicipalInAgendamento1751987757483
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE agendamento 
            SET secretaria_municipal_id = la.secretaria_municipal_id
            FROM local_atendimento la
            WHERE agendamento.local_atendimento_id = la.id 
            AND agendamento.secretaria_municipal_id IS NULL
            AND la.secretaria_municipal_id IS NOT NULL
        `);
  }

  public async down(): Promise<void> {}
}
