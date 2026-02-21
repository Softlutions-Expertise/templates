import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  Cargo,
  NivelAcesso,
} from '../../modules/pessoa/entities/enums/pessoa.enum';

export class UpdateFuncionarioSetNullVinculosAdmDefensoria1709217792586
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE pessoa_funcionario
        SET
          cargo = $1,
          tipo_vinculo = NULL,
          instituicao_id = NULL
        WHERE (
          id IN (
            SELECT funcionario.id FROM pessoa_funcionario funcionario
            INNER JOIN usuario ON funcionario.usuario_id = usuario.id
            WHERE usuario.nivel_acesso = $2
          )
        );`,
      [Cargo['Administrador TCE'], NivelAcesso.Administrador],
    );

    await queryRunner.query(
      `UPDATE pessoa_funcionario
        SET
          cargo = $1,
          tipo_vinculo = NULL,
          instituicao_id = NULL
        WHERE (
          id IN (
            SELECT funcionario.id FROM pessoa_funcionario funcionario
            INNER JOIN usuario ON funcionario.usuario_id = usuario.id
            WHERE usuario.nivel_acesso = $2
          )
        );`,
      [Cargo['Assessor(a) da Defensoria'], NivelAcesso.Defensoria],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
    console.debug();
  }
}
