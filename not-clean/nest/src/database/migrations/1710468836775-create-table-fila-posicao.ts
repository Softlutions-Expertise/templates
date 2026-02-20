import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableFilaPosicao1710468836775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'fila_gerada_posicao',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
              },
    
              //
    
              {
                name: 'posicao_geral',
                type: 'int',
                isNullable: false,
              },
    
              //
    
              {
                name: 'fila_id',
                type: 'uuid',
                isNullable: false,
              },
    
              {
                name: 'entrevista_id',
                type: 'uuid',
                isNullable: false,
              },
    
              //
    
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
                columnNames: ['fila_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'fila',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              {
                columnNames: ['entrevista_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'entrevista',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
            ],
          }),
        );

    }
    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.dropTable('fila_gerada_posicao');
    }

}
