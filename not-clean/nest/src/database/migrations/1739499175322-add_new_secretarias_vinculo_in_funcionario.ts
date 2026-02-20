import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddNewSecretariasVinculoInFuncionario1739499175321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'funcionario_secretarias',
        columns: [
          {
            name: 'funcionario_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'secretaria_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
        uniques: [
          {
            name: 'PK_funcionario_secretarias',
            columnNames: ['funcionario_id', 'secretaria_id'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'funcionario_secretarias',
      new TableForeignKey({
        columnNames: ['funcionario_id'],
        referencedTableName: 'pessoa_funcionario',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'funcionario_secretarias',
      new TableForeignKey({
        columnNames: ['secretaria_id'],
        referencedTableName: 'secretaria_municipal',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(`
          INSERT INTO funcionario_secretarias (funcionario_id, secretaria_id)
          SELECT id AS funcionario_id, instituicao_id
          FROM pessoa_funcionario
          WHERE tipo_vinculo = 'Secretaria Municipal'
            AND instituicao_id IS NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('funcionario_secretarias');

    await queryRunner.dropForeignKey(
      'funcionario_secretarias',
      'funcionario_id',
    );

    await queryRunner.dropForeignKey(
      'funcionario_secretarias',
      'secretaria_id',
    );

    await queryRunner.query(`DELETE FROM funcionario_secretarias`);
  }
}
