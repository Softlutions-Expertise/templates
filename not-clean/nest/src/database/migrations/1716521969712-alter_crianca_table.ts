import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCriancaTable1716521969712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE crianca RENAME COLUMN registro_nascional_estrangeiro TO registro_nacional_estrangeiro`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `ALTER TABLE crianca RENAME COLUMN registro_nacional_estrangeiro TO registro_nascional_estrangeiro`,
      );
  }
}
