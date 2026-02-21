import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableCodigoReservaVaga1710979912344 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'codigo_reserva_vaga',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'count',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'ano',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'secretaria_municipal_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'NOW()',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['secretaria_municipal_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'secretaria_municipal',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('codigo_reserva_vaga');
    }
}
