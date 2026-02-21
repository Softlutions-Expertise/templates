import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterSecretariaMunicipalEtapaAndSecretariaMunicipalTable1726616121766
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('secretaria_municipal_etapa', 'data_limite');

    await queryRunner.addColumn(
      'secretaria_municipal',
      new TableColumn({
        name: 'data_limite',
        type: 'varchar',
        default: "'03-31'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'secretaria_municipal_etapa',
      new TableColumn({
        name: 'data_limite',
        type: 'varchar',
        default: "'03-31'",
      }),
    );

    await queryRunner.dropColumn('secretaria_municipal', 'data_limite');
  }
}
