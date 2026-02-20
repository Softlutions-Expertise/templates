import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFildComprovanteInRegistrarContato1757097369675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registrar_contato" ADD COLUMN "comprovante" varchar`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registrar_contato" DROP COLUMN "comprovante"`);
    }

}
