import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterAgendamentoColumReagendamentoEmProgresso1718319384182 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("agendamento", new TableColumn({
            name: "reagendamento_em_progresso",
            type: "boolean",
            default: 'FALSE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("agendamento", "reagendamento_em_progresso");
    }
}
