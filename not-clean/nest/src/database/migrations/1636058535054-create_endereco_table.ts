import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEnderecoTable1636058535054 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'base_endereco',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'logradouro',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'numero',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bairro',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'complemento',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'ponto_referencia',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'cep',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'localizacao_diferenciada',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'zona',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'cidade_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'distrito_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'subdistrito_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'latitude',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'varchar',
            length: '200',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'base_endereco',
      new TableForeignKey({
        columnNames: ['cidade_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cidade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('base_endereco');

    const columnCidadeId = table?.foreignKeys.find((i) =>
      i.columnNames.includes('cidade_id'),
    );
    columnCidadeId &&
      (await queryRunner.dropForeignKey('base_endereco', columnCidadeId));

    await queryRunner.dropTable('base_endereco');
  }
}
