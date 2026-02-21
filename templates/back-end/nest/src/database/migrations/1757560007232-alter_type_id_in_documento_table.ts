import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTypeIdInDocumentoTable1757560007232
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey('documento');

    await queryRunner.changeColumn(
      'documento',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'uuid',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey('documento');

    await queryRunner.changeColumn(
      'documento',
      'id',
      new TableColumn({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
  }
}
