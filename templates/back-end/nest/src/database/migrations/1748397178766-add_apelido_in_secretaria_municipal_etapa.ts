import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApelidoInSecretariaMunicipalEtapa1748397178766 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE secretaria_municipal_etapa
            ADD COLUMN apelido VARCHAR(255) DEFAULT '';
        `);

        await queryRunner.query(`
            UPDATE secretaria_municipal_etapa 
            SET apelido = etapa.nome
            FROM etapa 
            WHERE secretaria_municipal_etapa.etapa_id = etapa.id;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE secretaria_municipal_etapa
            DROP COLUMN apelido;
        `);
    }

}