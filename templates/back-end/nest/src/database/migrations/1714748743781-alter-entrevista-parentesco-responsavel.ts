import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterEntrevistaParentescoResponsavel1714748743781
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'entrevista',
      new TableColumn({
        type: 'text',
        isNullable: true,
        name: 'parentesco_responsavel',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('entrevista', 'parentesco_responsavel');
  }
}
