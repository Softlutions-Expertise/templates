import { MigrationInterface, QueryRunner } from 'typeorm';

// ----------------------------------------------------------------------

export class SeedDefaultCategories1700000000003 implements MigrationInterface {
  name = 'SeedDefaultCategories1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Esta migration é um placeholder. As categorias padrão serão criadas
    // por usuário quando ele se registrar
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Nada a fazer
  }
}
