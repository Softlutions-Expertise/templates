import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterCriteriosAndCriteriosConfiguracaoAndCriteriosConfiguracaoCriteriosTable1720814390535
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Chave estrangeira para criterios
    let table = await queryRunner.getTable('criterios');
    let foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('secretaria_municipal_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('criterios', foreignKey);
    }
    await queryRunner.createForeignKey(
      'criterios',
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Chave estrangeira para criterios_configuracao
    table = await queryRunner.getTable('criterios_configuracao');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('secretaria_municipal_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('criterios_configuracao', foreignKey);
    }
    await queryRunner.createForeignKey(
      'criterios_configuracao',
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Chave estrangeira para criterios_configuracao_criterio
    table = await queryRunner.getTable('criterios_configuracao_criterio');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('criterios_configuracao_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey(
        'criterios_configuracao_criterio',
        foreignKey,
      );
    }
    await queryRunner.createForeignKey(
      'criterios_configuracao_criterio',
      new TableForeignKey({
        columnNames: ['criterios_configuracao_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterios_configuracao',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    table = await queryRunner.getTable('criterios_configuracao_criterio');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('criterio_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey(
        'criterios_configuracao_criterio',
        foreignKey,
      );
    }
    await queryRunner.createForeignKey(
      'criterios_configuracao_criterio',
      new TableForeignKey({
        columnNames: ['criterio_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterios',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Atualizar chave estrangeira de criterios para remover onDelete e onUpdate
    let table = await queryRunner.getTable('criterios');
    let foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('secretaria_municipal_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('criterios', foreignKey);
    }
    await queryRunner.createForeignKey(
      'criterios',
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    );

    // Atualizar chave estrangeira de criterios_configuracao para remover onDelete e onUpdate
    table = await queryRunner.getTable('criterios_configuracao');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('secretaria_municipal_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('criterios_configuracao', foreignKey);
    }
    await queryRunner.createForeignKey(
      'criterios_configuracao',
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    );

    // Atualizar chave estrangeira de criterios_configuracao_criterio para remover onDelete e onUpdate
    table = await queryRunner.getTable('criterios_configuracao_criterio');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('criterios_configuracao_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey(
        'criterios_configuracao_criterio',
        foreignKey,
      );
    }
    await queryRunner.createForeignKey(
      'criterios_configuracao_criterio',
      new TableForeignKey({
        columnNames: ['criterios_configuracao_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterios_configuracao',
      }),
    );
    table = await queryRunner.getTable('criterios_configuracao_criterio');
    foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('criterio_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey(
        'criterios_configuracao_criterio',
        foreignKey,
      );
    }
    await queryRunner.createForeignKey(
      'criterios_configuracao_criterio',
      new TableForeignKey({
        columnNames: ['criterio_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'criterios',
      }),
    );
  }
}
