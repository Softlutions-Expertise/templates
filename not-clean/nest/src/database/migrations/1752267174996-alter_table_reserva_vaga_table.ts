import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableReservaVagaTable1752267174996
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "reserva_vaga_status_enum" ADD VALUE 'Transferida'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "reserva_vaga_status_enum_temp" AS ENUM('Pendente', 'Deferida', 'Indeferida', 'Ausente')`,
    );

    await queryRunner.query(
      `ALTER TABLE "reserva_vaga" 
       ALTER COLUMN "status" TYPE "reserva_vaga_status_enum_temp" 
       USING CASE 
         WHEN "status" = 'Transferida' THEN 'Pendente'::reserva_vaga_status_enum_temp
         ELSE "status"::text::reserva_vaga_status_enum_temp
       END`,
    );

    await queryRunner.query(`DROP TYPE "reserva_vaga_status_enum"`);

    await queryRunner.query(
      `ALTER TYPE "reserva_vaga_status_enum_temp" RENAME TO "reserva_vaga_status_enum"`,
    );
  }
}
