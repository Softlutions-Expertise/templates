import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterRegistroContatoStatus1726862558124 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE registrar_contato SET ligacao_aceita = 'Vaga Aceita' WHERE ligacao_aceita = 'Aceito'`);
    await queryRunner.query(`UPDATE registrar_contato SET ligacao_aceita = 'Vaga Recusada' WHERE ligacao_aceita = 'Recusado'`);
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.query(`UPDATE registrar_contato SET ligacao_aceita = 'Aceito' WHERE ligacao_aceita = 'Vaga Aceita'`);
     await queryRunner.query(`UPDATE registrar_contato SET ligacao_aceita = 'Recusado' WHERE ligacao_aceita = 'Vaga Recusada'`);
    }

}
