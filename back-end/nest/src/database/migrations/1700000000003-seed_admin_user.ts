import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await queryRunner.query(`
      INSERT INTO users (name, email, password, role, is_active, email_verified_at)
      VALUES ('Administrador', 'admin@example.com', '${passwordHash}', 'admin', true, now())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'admin@example.com'
    `);
  }
}
