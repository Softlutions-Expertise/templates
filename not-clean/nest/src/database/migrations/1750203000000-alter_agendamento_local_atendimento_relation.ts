import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterAgendamentoLocalAtendimentoRelation1750203000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the current table structure
    const table = await queryRunner.getTable('agendamento');
    if (!table) {
      throw new Error('Table agendamento not found');
    }

    // Check if local_atendimento_id column already exists
    const localAtendimentoColumn = table.findColumnByName('local_atendimento_id');
    
    if (!localAtendimentoColumn) {
      // Add the new local_atendimento_id column
      await queryRunner.addColumn(
        'agendamento',
        new TableColumn({
          name: 'local_atendimento_id',
          type: 'uuid',
          isNullable: true, // temporary to allow data migration
        }),
      );

      // Migrate data: For each agendamento, find the corresponding local_atendimento
      // based on the secretaria_municipal_id
      await queryRunner.query(`
        UPDATE agendamento 
        SET local_atendimento_id = (
          SELECT la.id 
          FROM local_atendimento la 
          WHERE la.secretaria_municipal_id = agendamento.secretaria_municipal_id
          LIMIT 1
        )
      `);

      // Check for any agendamentos that couldn't be migrated
      const orphanCount = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM agendamento 
        WHERE local_atendimento_id IS NULL
      `);

      if (orphanCount[0].count > 0) {
        throw new Error(
          `Found ${orphanCount[0].count} agendamentos that could not be migrated. ` +
          'Please ensure all secretarias have corresponding local_atendimento records.'
        );
      }

      // Make the column not nullable
      await queryRunner.changeColumn(
        'agendamento',
        'local_atendimento_id',
        new TableColumn({
          name: 'local_atendimento_id',
          type: 'uuid',
          isNullable: false,
        }),
      );

      // Create the new foreign key constraint
      await queryRunner.createForeignKey(
        'agendamento',
        new TableForeignKey({
          columnNames: ['local_atendimento_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'local_atendimento',
          onDelete: 'CASCADE',
        }),
      );
    }

    // NOTE: We keep secretaria_municipal_id for backward compatibility
    // It will be removed in a future migration after all references are updated
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the current table structure
    const table = await queryRunner.getTable('agendamento');
    if (!table) {
      throw new Error('Table agendamento not found');
    }

    // Check if local_atendimento_id column exists and drop it
    const localAtendimentoColumn = table.findColumnByName('local_atendimento_id');
    if (localAtendimentoColumn) {
      // Drop the local_atendimento foreign key
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('local_atendimento_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('agendamento', foreignKey);
      }

      // Drop the local_atendimento_id column
      await queryRunner.dropColumn('agendamento', 'local_atendimento_id');
    }

    // NOTE: secretaria_municipal_id should remain as it was before this migration
  }
}
