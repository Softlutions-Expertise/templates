import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSubstatusInReservaVagaTable1757464014047
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'reserva_vaga',
      new TableColumn({
        name: 'substatus',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.query(`
      ALTER TABLE reserva_vaga 
      ALTER COLUMN status DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE reserva_vaga 
      ALTER COLUMN status TYPE varchar 
      USING status::text
    `);

    await queryRunner.query(`DROP TYPE IF EXISTS "reserva_vaga_status_enum"`);

    await queryRunner.query(`
      ALTER TABLE reserva_vaga 
      ALTER COLUMN status SET DEFAULT 'Pendente'
    `);

    await queryRunner.query(`
      UPDATE reserva_vaga 
      SET status = 'Indeferida', substatus = 'Ausente' 
      WHERE status = 'Ausente'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE reserva_vaga 
      SET status = 'Ausente', substatus = NULL 
      WHERE status = 'Indeferida' AND substatus = 'Ausente'
    `);

    await queryRunner.query(`
      ALTER TABLE reserva_vaga 
      ALTER COLUMN status DROP DEFAULT
    `);

    await queryRunner.query(
      `CREATE TYPE "reserva_vaga_status_enum" AS ENUM('Pendente', 'Deferida', 'Indeferida', 'Ausente', 'Transferida')`,
    );

    await queryRunner.query(`
      ALTER TABLE reserva_vaga 
      ALTER COLUMN status TYPE reserva_vaga_status_enum 
      USING status::reserva_vaga_status_enum
    `);

    await queryRunner.query(`
      ALTER TABLE reserva_vaga 
      ALTER COLUMN status SET DEFAULT 'Pendente'::reserva_vaga_status_enum
    `);

    await queryRunner.dropColumn('reserva_vaga', 'substatus');
  }
}
