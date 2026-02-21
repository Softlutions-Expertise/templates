import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldLogoInSecretariaMunicipalTable1760989289020
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'secretaria_municipal',
      new TableColumn({
        name: 'logo',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('secretaria_municipal', 'logo');
  }
}
