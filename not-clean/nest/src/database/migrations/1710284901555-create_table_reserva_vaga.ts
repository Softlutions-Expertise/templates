import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableReservaVaga1710284901555 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'reserva_vaga',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'codigo_reserva_vaga',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'funcionario_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'vaga_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'crianca_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'entrevista_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'registro_contato_id',
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
                        columnNames: ['funcionario_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'pessoa_funcionario',
                    },
                    {
                        columnNames: ['vaga_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'vagas',
                    },
                    {
                        columnNames: ['crianca_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'crianca',
                    },
                    {
                        columnNames: ['entrevista_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'entrevista',
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        columnNames: ['registro_contato_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'registrar_contato',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('reserva_vaga');
    }
}
