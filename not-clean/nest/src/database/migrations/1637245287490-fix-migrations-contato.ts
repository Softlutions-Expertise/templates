import { MigrationInterface, QueryRunner } from 'typeorm';

const migrationsTable = 'migrations_ms_fila_espera';

const right = 'CreateContatoTable1637245287494';
const wrong = 'CreateContatoTable1637245287496';

export class FixMigrationsContato1637245287490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE ${migrationsTable}
        SET "name"='${right}'
        WHERE "name"='${wrong}';
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE ${migrationsTable}
        SET "name"='${wrong}'
        WHERE "name"='${right}';
      `);
  }
}
