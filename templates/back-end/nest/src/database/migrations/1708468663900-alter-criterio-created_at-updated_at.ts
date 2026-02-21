import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCriterioCreatedAtUpdatedAt1708468663900
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('criterios', [
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'NOW()',
        isNullable: false,
      }),

      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('criterios', ['created_at', 'updated_at']);
  }
}
