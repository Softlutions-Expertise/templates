import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterEntrevistaAnoLetivoTable1733281271512
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('entrevista', [
      new TableColumn({
        name: 'ano_letivo',
        type: 'varchar',
        default: '2024',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('entrevista', 'ano_letivo');
  }
}
