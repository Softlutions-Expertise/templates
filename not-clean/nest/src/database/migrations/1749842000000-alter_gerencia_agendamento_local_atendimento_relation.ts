import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterGerenciaAgendamentoLocalAtendimentoRelation1749842000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old foreign key constraint
    const table = await queryRunner.getTable('gerencia_agendamento');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('secretaria_municipal_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('gerencia_agendamento', foreignKey);
      }
    }

    // Add the new local_atendimento_id column
    await queryRunner.addColumn(
      'gerencia_agendamento',
      new TableColumn({
        name: 'local_atendimento_id',
        type: 'uuid',
        isNullable: true, // temporary to allow data migration
      }),
    );

    // Migrate data: For each gerencia_agendamento, find the corresponding local_atendimento
    // This assumes each secretaria_municipal has one local_atendimento (which should be the case after population)
    await queryRunner.query(`
      UPDATE gerencia_agendamento 
      SET local_atendimento_id = (
        SELECT la.id 
        FROM local_atendimento la 
        WHERE la.secretaria_municipal_id = gerencia_agendamento.secretaria_municipal_id
        LIMIT 1
      )
    `);

    // Make the column not nullable
    await queryRunner.changeColumn(
      'gerencia_agendamento',
      'local_atendimento_id',
      new TableColumn({
        name: 'local_atendimento_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Create the new foreign key constraint
    await queryRunner.createForeignKey(
      'gerencia_agendamento',
      new TableForeignKey({
        columnNames: ['local_atendimento_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'local_atendimento',
        onDelete: 'CASCADE',
      }),
    );

    // Drop the old secretaria_municipal_id column
    await queryRunner.dropColumn('gerencia_agendamento', 'secretaria_municipal_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the secretaria_municipal_id column
    await queryRunner.addColumn(
      'gerencia_agendamento',
      new TableColumn({
        name: 'secretaria_municipal_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Migrate data back
    await queryRunner.query(`
      UPDATE gerencia_agendamento 
      SET secretaria_municipal_id = (
        SELECT la.secretaria_municipal_id 
        FROM local_atendimento la 
        WHERE la.id = gerencia_agendamento.local_atendimento_id
      )
    `);

    // Make secretaria_municipal_id not nullable
    await queryRunner.changeColumn(
      'gerencia_agendamento',
      'secretaria_municipal_id',
      new TableColumn({
        name: 'secretaria_municipal_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Drop the local_atendimento foreign key
    const table = await queryRunner.getTable('gerencia_agendamento');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('local_atendimento_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('gerencia_agendamento', foreignKey);
      }
    }

    // Drop the local_atendimento_id column
    await queryRunner.dropColumn('gerencia_agendamento', 'local_atendimento_id');

    // Recreate the secretaria_municipal foreign key
    await queryRunner.createForeignKey(
      'gerencia_agendamento',
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    );
  }
}
