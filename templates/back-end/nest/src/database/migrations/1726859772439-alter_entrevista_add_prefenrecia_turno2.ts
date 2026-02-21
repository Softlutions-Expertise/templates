import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterEntrevistaAddPrefenreciaTurno21726859772439 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "entrevista" ADD COLUMN "preferencia_turno2" varchar`);

        await queryRunner.query(`
            UPDATE entrevista
            SET preferencia_turno2 = preferencia_turno
            WHERE preferencia_turno2 IS NULL OR preferencia_turno2 = ''
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entrevista" DROP COLUMN "preferencia_turno2"`);
    }

} 
