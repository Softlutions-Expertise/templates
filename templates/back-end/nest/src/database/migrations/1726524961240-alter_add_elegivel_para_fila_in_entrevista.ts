import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAddElegivelParaFilaInEntrevista1726524961240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE entrevista ADD COLUMN elegivel_para_fila BOOLEAN DEFAULT TRUE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE entrevista DROP COLUMN elegivel_para_fila;`);
    }

}
