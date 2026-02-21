import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOpcaoCategoriaTable1649362020950
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'escola_opcao_categoria',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'numero',
            type: 'int',
          },

          {
            name: 'descricao',
            type: 'varchar',
          },

          {
            name: 'multipla_escolha',
            type: 'bool',
            default: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('escola_opcao_categoria');
  }
}
