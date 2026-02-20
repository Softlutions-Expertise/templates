import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServidorInRegistrarContatoTable1759431247268 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "registrar_contato" 
            ADD COLUMN "servidor" uuid
        `);

        await queryRunner.query(`
            ALTER TABLE "registrar_contato" 
            ADD CONSTRAINT "FK_registrar_contato_servidor" 
            FOREIGN KEY ("servidor") 
            REFERENCES "pessoa_funcionario"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "registrar_contato" 
            DROP CONSTRAINT "FK_registrar_contato_servidor"
        `);

        await queryRunner.query(`
            ALTER TABLE "registrar_contato" 
            DROP COLUMN "servidor"
        `);
    }

}
