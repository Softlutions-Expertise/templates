import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessaoIndex1700000000007 implements MigrationInterface {
  name = 'AddSessaoIndex1700000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona índice para o campo jwt_token para melhorar performance das consultas de sessão
    await queryRunner.query(`
      CREATE INDEX idx_auditoria_jwt_token ON auditorias(jwt_token) WHERE jwt_token IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_auditoria_jwt_token;
    `);
  }
}
