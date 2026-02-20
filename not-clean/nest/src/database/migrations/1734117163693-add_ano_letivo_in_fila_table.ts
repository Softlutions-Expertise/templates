import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnoLetivoInFilaTable1734117163693 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE fila ADD COLUMN ano_letivo VARCHAR(4)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE fila DROP COLUMN ano_letivo`);
    }

}
