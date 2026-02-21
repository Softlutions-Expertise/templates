import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Crianca1696095832542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'crianca',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'cpf',
            isUnique: true,
            type: 'varchar',
          },
          {
            name: 'sexo',
            type: 'varchar',
          },
          {
            name: 'data_nascimento',
            type: 'timestamp',
          },
          {
            name: 'numero_sus',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pais_origem',
            type: 'varchar',
          },
          {
            name: 'registro_nascional_estrangeiro',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'protocolo_refugio',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'numero_unidade_consumidora',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'numero_unidade_matricula_iptu',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'endereco_id',
            type: 'uuid',
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
      }),
    );
    await queryRunner.addColumns('crianca', [
      new TableColumn({
        name: 'responsavel_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
    await queryRunner.createForeignKeys('crianca', [
      new TableForeignKey({
        columnNames: ['responsavel_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'responsavel',
      }),
    ]);

    await queryRunner.addColumns('crianca', [
      new TableColumn({
        name: 'responsavel2_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
    await queryRunner.createForeignKeys('crianca', [
      new TableForeignKey({
        columnNames: ['responsavel2_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'responsavel',
      }),
    ]);

    await queryRunner.createForeignKey(
      'crianca',
      new TableForeignKey({
        columnNames: ['endereco_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_endereco',
      }),
    );

    await queryRunner.addColumn(
      'crianca',
      new TableColumn({
        name: 'contato_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'crianca',
      new TableForeignKey({
        columnNames: ['contato_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_contato',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('crianca');
  }
}
