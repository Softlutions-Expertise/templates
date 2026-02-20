import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AlterTableFila1710292512927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //apgar a coluna posicao
        await queryRunner.query(`ALTER TABLE fila DROP COLUMN colocacao`);
        await queryRunner.addColumns('fila', [
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'NOW()',
                isNullable: false,
            }),

            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                isNullable: true,
            }),

            new TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),

            new TableColumn({
                name: 'escola_id',
                type: 'uuid',
                isNullable: true,
            }),
            
            new TableColumn({
                name: 'turno',
                type: 'varchar',
                isNullable: true,
            }),

            new TableColumn({
                name: 'etapa',
                type: 'varchar',
                isNullable: true,
            }),

        ]);
        await queryRunner.createForeignKeys('fila', [
            new TableForeignKey({
                columnNames: ['escola_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'escola',
            }),
        ]);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // oi
    }

}
