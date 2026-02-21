import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEtapaTable1724799047280 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'etapa',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
      INSERT INTO etapa (id, nome, created_at) VALUES
      (1, 'Berçário I', NOW()),
      (2, 'Berçário II', NOW()),
      (3, 'Maternal I', NOW()),
      (4, 'Maternal II', NOW()),
      (5, 'Pré I', NOW()),
      (6, 'Pré II', NOW());
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('etapa');
  }
}
