import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPessoaFuncionarioNullable1709209102111
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE pessoa_funcionario ALTER COLUMN tipo_vinculo DROP NOT NULL;`,
    );

    await queryRunner.query(
      `ALTER TABLE pessoa_funcionario ALTER COLUMN instituicao_id DROP NOT NULL;`,
    );

    await queryRunner.query(
      `ALTER TABLE pessoa_funcionario ALTER COLUMN cargo DROP NOT NULL;`,
    );

    // tipo_vinculo = NULL,
    // instituicao_id = NULL,

    await queryRunner.query(
      `UPDATE pessoa_funcionario
        SET
          cargo = $1
        WHERE (
          id IN (
            SELECT funcionario.id FROM pessoa_funcionario funcionario
            INNER JOIN usuario ON funcionario.usuario_id = usuario.id
            WHERE usuario.nivel_acesso = $2
          )
        );`,
      ["Administrador", "Administrador"],
    );

    await queryRunner.query(
      `UPDATE pessoa_funcionario
        SET
          cargo = $1
        WHERE (
          id IN (
            SELECT funcionario.id FROM pessoa_funcionario funcionario
            INNER JOIN usuario ON funcionario.usuario_id = usuario.id
            WHERE usuario.nivel_acesso = $2
          )
        );`,
      ["Defensor Público", "Defensoria"],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
    console.debug();
  }
}
