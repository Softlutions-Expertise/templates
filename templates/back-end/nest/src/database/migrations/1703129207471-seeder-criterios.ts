import { SqlReader } from 'node-sql-reader';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeederCriterios1703129207471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queriesCriterios = SqlReader.readSqlFile(
      path.join(__dirname, '../sqls/criterios.sql'),
    );

    for (const query of queriesCriterios) {
      await queryRunner.query(query);
    }
  }
  //

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from criterios`);
  }
}
