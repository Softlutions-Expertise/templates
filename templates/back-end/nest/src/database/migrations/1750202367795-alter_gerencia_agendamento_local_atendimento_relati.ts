import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterGerenciaAgendamentoLocalAtendimentoRelati1750202367795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the current table structure
    const table = await queryRunner.getTable('gerencia_agendamento');
    if (!table) {
      throw new Error('Table gerencia_agendamento not found');
    }

    // Check if local_atendimento_id column already exists
    const localAtendimentoColumn = table.findColumnByName('local_atendimento_id');
    
    if (!localAtendimentoColumn) {
      // Drop the old foreign key constraint if it exists
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('secretaria_municipal_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('gerencia_agendamento', foreignKey);
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
    }

    // Check if secretaria_municipal_id column still exists and drop it
    const secretariaColumn = table.findColumnByName('secretaria_municipal_id');
    if (secretariaColumn) {
      // If we didn't drop the FK above, drop it now
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('secretaria_municipal_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('gerencia_agendamento', foreignKey);
      }
      
      await queryRunner.dropColumn('gerencia_agendamento', 'secretaria_municipal_id');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the current table structure
    const table = await queryRunner.getTable('gerencia_agendamento');
    if (!table) {
      throw new Error('Table gerencia_agendamento not found');
    }

    // Check if secretaria_municipal_id column already exists
    const secretariaColumn = table.findColumnByName('secretaria_municipal_id');
    
    if (!secretariaColumn) {
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

    // Check if local_atendimento_id column exists and drop it
    const localAtendimentoColumn = table.findColumnByName('local_atendimento_id');
    if (localAtendimentoColumn) {
      // Drop the local_atendimento foreign key
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('local_atendimento_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('gerencia_agendamento', foreignKey);
      }

      // Drop the local_atendimento_id column
      await queryRunner.dropColumn('gerencia_agendamento', 'local_atendimento_id');
    }
  }
}
