import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusInEnrevistaTable1752258404071
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE "entrevista_status_enum" AS ENUM ('Aguardando', 'Concluido', 'Transferencia')
    `);

    await queryRunner.addColumn(
      'entrevista',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enumName: 'entrevista_status_enum',
        default: "'Aguardando'",
      }),
    );

    await queryRunner.query(`
            UPDATE "entrevista" 
            SET "status" = CASE 
                WHEN EXISTS (
                    SELECT 1 FROM "reserva_vaga" rv 
                    WHERE rv."entrevista_id" = "entrevista"."id"
                ) THEN 'Concluido'::entrevista_status_enum
                ELSE 'Aguardando'::entrevista_status_enum
            END
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "entrevista" DROP COLUMN "status"
        `);

    await queryRunner.query(`
            DROP TYPE "entrevista_status_enum"
        `);
  }
}
