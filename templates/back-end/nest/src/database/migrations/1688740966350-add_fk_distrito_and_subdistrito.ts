import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddFkDistritoAndSubdistrito1688740966350
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'base_endereco',
      new TableForeignKey({
        columnNames: ['distrito_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'distrito',
      }),
    );
    await queryRunner.createForeignKey(
      'base_endereco',
      new TableForeignKey({
        columnNames: ['subdistrito_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'subdistrito',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('base_endereco', 'distrito_id');
    await queryRunner.dropForeignKey('base_endereco', 'subdistrito_id');
  }
}
