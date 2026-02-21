import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterRegistrarContatoAndEntrevistaMatchCriterioAndReservaVagaTable1721092814244
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Chave estrangeira para registrar_contato
    let table = await queryRunner.getTable('registrar_contato');
    let foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('entrevista_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('registrar_contato', foreignKey);
    }
    await queryRunner.createForeignKey(
      'registrar_contato',
      new TableForeignKey({
        columnNames: ['entrevista_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entrevista',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Chave estrangeira para entrevista_match_criterio
    table = await queryRunner.getTable('entrevista_match_criterio');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('entrevista_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('entrevista_match_criterio', foreignKey);
    }
    await queryRunner.createForeignKey(
      'entrevista_match_criterio',
      new TableForeignKey({
        columnNames: ['entrevista_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entrevista',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Remover onDelete e onUpdate de reserva_vaga
    // Chave estrangeira para reserva_vaga
    table = await queryRunner.getTable('reserva_vaga');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('entrevista_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('reserva_vaga', foreignKey);
    }
    await queryRunner.createForeignKey(
      'reserva_vaga',
      new TableForeignKey({
        columnNames: ['entrevista_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entrevista',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Atualizar chave estrangeira de registrar_contato para remover onDelete  e onUpdate
    let table = await queryRunner.getTable('registrar_contato');
    let foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('entrevista_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('registrar_contato', foreignKey);
    }
    await queryRunner.createForeignKey(
      'registrar_contato',
      new TableForeignKey({
        columnNames: ['entrevista_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entrevista',
      }),
    );

    // Atualizar chave estrangeira de entrevista_match_criterio para remover onDelete  e onUpdate
    table = await queryRunner.getTable('entrevista_match_criterio');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('entrevista_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('entrevista_match_criterio', foreignKey);
    }
    await queryRunner.createForeignKey(
      'entrevista_match_criterio',
      new TableForeignKey({
        columnNames: ['entrevista_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entrevista',
      }),
    );

    // Atualizar chave estrangeira de reserva_vaga para adicionar onDelete e onUpdate
    table = await queryRunner.getTable('reserva_vaga');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('entrevista_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('reserva_vaga', foreignKey);
    }
    await queryRunner.createForeignKey(
      'reserva_vaga',
      new TableForeignKey({
        columnNames: ['entrevista_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'entrevista',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
