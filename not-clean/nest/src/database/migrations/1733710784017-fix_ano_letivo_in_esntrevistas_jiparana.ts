import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAnoLetivoInEsntrevistasJiparana1733710784017 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const secretarias = await queryRunner.query(`SELECT * FROM secretaria_municipal WHERE nome_fantasia LIKE '%Ji-Paraná%'`);
        for (const secretaria of secretarias) {
                await queryRunner.query(`UPDATE entrevista SET ano_letivo = 2025 WHERE secretaria_municipal_id = '${secretaria.id}'`); 
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const secretarias = await queryRunner.query(`SELECT * FROM secretaria_municipal WHERE nome_fantasia LIKE '%Ji-Paraná%'`);
        for (const secretaria of secretarias) {
            await queryRunner.query(`UPDATE entrevista SET ano_letivo = 2024 WHERE secretaria_municipal_id = '${secretaria.id}'`); 
    }
    }

}
