import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class Import1687298866210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queriesContato = SqlReader.readSqlFile(
      path.join(__dirname, '../sqls/base_contato_escola.sql'),
    );
    const queriesEndereco = SqlReader.readSqlFile(
      path.join(__dirname, '../sqls/base_endereco_escola.sql'),
    );
    const queriesSecretaria = SqlReader.readSqlFile(
      path.join(__dirname, '../sqls/secretaria_municipal_escola.sql'),
    );
    const queriesEscola = SqlReader.readSqlFile(
      path.join(__dirname, '../sqls/escola.sql'),
    );

    for (const query of queriesContato) {
      await queryRunner.query(query);
    }
    for (const query of queriesEndereco) {
      await queryRunner.query(query);
    }
    for (const query of queriesSecretaria) {
      await queryRunner.query(query);
    }
    for (const query of queriesEscola) {
      await queryRunner.query(query);
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('escola');
  }
}
