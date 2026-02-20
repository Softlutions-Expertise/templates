import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterAgendamentoTable1722469569971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("agendamento", new TableColumn({
            name: "status",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("agendamento", "status");
    }
}
