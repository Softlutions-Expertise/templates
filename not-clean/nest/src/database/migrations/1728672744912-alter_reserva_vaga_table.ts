import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterReservaVagaTable1728672744912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "reserva_vaga_status_enum" AS ENUM('Pendente', 'Deferida', 'Indeferida', 'Ausente')`,
    );

    await queryRunner.addColumn(
      'reserva_vaga',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enumName: 'reserva_vaga_status_enum',
        default: "'Pendente'",
      }),
    );

    await queryRunner.addColumn(
      'reserva_vaga',
      new TableColumn({
        name: 'matricula',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'reserva_vaga',
      new TableColumn({
        name: 'observacao',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('reserva_vaga', 'status');
    await queryRunner.dropColumn('reserva_vaga', 'matricula');
    await queryRunner.dropColumn('reserva_vaga', 'observacao');

    await queryRunner.query(`DROP TYPE IF EXISTS "reserva_vaga_status_enum"`);
  }
}
