import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldPrazoMatriculaInEscolaTable1757640403651
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'escola',
      new TableColumn({
        name: 'prazo_matricula',
        type: 'int',
        isNullable: false,
        default: 3,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('escola', 'prazo_matricula');
  }
}
