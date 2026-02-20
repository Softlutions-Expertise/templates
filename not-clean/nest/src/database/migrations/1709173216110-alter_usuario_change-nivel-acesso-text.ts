import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsuarioChangeNivelAcessoText1709173216110
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE usuario ALTER COLUMN nivel_acesso TYPE text USING nivel_acesso::text;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
    console.debug();
  }
}
