import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterReservaVagaAddDataReferenciaTable1730243932024
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'reserva_vaga',
      new TableColumn({
        name: 'data_referencia',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('reserva_vaga', 'data_referencia');
  }
}
