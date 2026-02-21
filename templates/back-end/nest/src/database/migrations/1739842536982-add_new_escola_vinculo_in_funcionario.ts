import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddNewEscolaVinculoInFuncionario1739842536982
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'funcionario_escolas',
        columns: [
          {
            name: 'funcionario_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'escola_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
        uniques: [
          {
            name: 'PK_funcionario_escolas',
            columnNames: ['funcionario_id', 'escola_id'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'funcionario_escolas',
      new TableForeignKey({
        columnNames: ['funcionario_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pessoa_funcionario',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'funcionario_escolas',
      new TableForeignKey({
        columnNames: ['escola_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(`
          INSERT INTO funcionario_escolas (funcionario_id, escola_id)
            SELECT id AS funcionario_id, instituicao_id
            FROM pessoa_funcionario
            WHERE tipo_vinculo = 'Unidade Escolar' 
            AND instituicao_id IS NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('funcionario_escolas');

    await queryRunner.dropForeignKey('funcionario_escolas', 'funcionario_id');

    await queryRunner.dropForeignKey('funcionario_escolas', 'escola_id');
  }
}
