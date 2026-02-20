import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterDiasNaoUteisAddAtivoColumn1733935818997
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'dias_nao_uteis',
      new TableColumn({
        name: 'ativo',
        type: 'boolean',
        default: 'TRUE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('dias_nao_uteis', 'ativo');
  }
}
