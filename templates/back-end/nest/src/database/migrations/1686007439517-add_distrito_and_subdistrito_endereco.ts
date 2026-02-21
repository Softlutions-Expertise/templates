import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddDistritoAndSubdistritoEndereco1686007439517
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'distrito',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'subdistrito',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isNullable: true,
          },
          {
            name: 'nome',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('distrito');
    await queryRunner.dropTable('subdistrito');
  }
}
