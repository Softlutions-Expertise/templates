import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEtapaIdInSpecificTurmaTable1726882798561
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          UPDATE turma
          SET etapa_id = 2
          WHERE id = '82751826-a751-4845-b9ff-9a455b6f72b4' AND etapa_id = 1;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          UPDATE turma
          SET etapa_id = 1
          WHERE id = '82751826-a751-4845-b9ff-9a455b6f72b4' AND etapa_id = 2;
        `);
  }
}
