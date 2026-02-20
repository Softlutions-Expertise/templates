import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditoriaTable1700000000005 implements MigrationInterface {
  name = 'CreateAuditoriaTable1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE tipo_acao_enum AS ENUM ('login', 'create', 'update', 'delete');
    `);

    await queryRunner.query(`
      CREATE TABLE auditorias (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id uuid,
        usuario_email varchar(255),
        acao tipo_acao_enum NOT NULL,
        entidade varchar(100) NOT NULL,
        entidade_id uuid,
        dados_anteriores jsonb,
        dados_novos jsonb,
        descricao varchar(500),
        ip_address varchar(45),
        user_agent text,
        jwt_token text,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_auditoria_usuario_id ON auditorias(usuario_id);
      CREATE INDEX idx_auditoria_acao ON auditorias(acao);
      CREATE INDEX idx_auditoria_created_at ON auditorias(created_at DESC);
      CREATE INDEX idx_auditoria_entidade ON auditorias(entidade, entidade_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_auditoria_entidade;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_auditoria_created_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_auditoria_acao;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_auditoria_usuario_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS auditorias;`);
    await queryRunner.query(`DROP TYPE IF EXISTS tipo_acao_enum;`);
  }
}
