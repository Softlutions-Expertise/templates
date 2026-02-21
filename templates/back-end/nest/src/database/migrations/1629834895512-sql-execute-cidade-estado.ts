import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class SqlExecuteCidadeEstado1629834895512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = SqlReader.readSqlFile(
      path.join(__dirname, '../sqls/insert_estados_cidades.sql'),
    );
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM cidade');
    await queryRunner.query('DELETE FROM estado');
  }
}
