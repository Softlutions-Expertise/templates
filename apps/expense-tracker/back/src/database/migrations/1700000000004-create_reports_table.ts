import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportsTable1700000000004 implements MigrationInterface {
  name = 'CreateReportsTable1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE report_type_enum AS ENUM ('expense_summary', 'category_breakdown', 'monthly_trend');
      CREATE TYPE report_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed');
    `);

    await queryRunner.query(`
      CREATE TABLE reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        type report_type_enum NOT NULL,
        status report_status_enum NOT NULL DEFAULT 'pending',
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        start_date date,
        end_date date,
        category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
        file_url varchar(500),
        file_name varchar(255),
        error_message text,
        completed_at timestamp,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_reports_user_id ON reports(user_id);
      CREATE INDEX idx_reports_status ON reports(status);
      CREATE INDEX idx_reports_type ON reports(type);
      CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_reports_created_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_reports_type;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_reports_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_reports_user_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS reports;`);
    await queryRunner.query(`DROP TYPE IF EXISTS report_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS report_type_enum;`);
  }
}
