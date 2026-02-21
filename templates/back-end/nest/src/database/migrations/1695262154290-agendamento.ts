import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Agendamento1695262154290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agendamento',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'horario_agendamento',
            type: 'varchar',
          },
          {
            name: 'nome_crianca',
            type: 'varchar',
          },
          {
            name: 'cpf_crianca',
            type: 'varchar',
          },
          {
            name: 'data_nascimento',
            type: 'timestamp',
          },
          {
            name: 'data',
            type: 'timestamp',
          },
          {
            name: 'horario',
            type: 'varchar',
          },
          {
            name: 'nome_res',
            type: 'varchar',
          },
          {
            name: 'cpf_res',
            type: 'varchar',
          },
          {
            name: 'telefone',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.addColumns('agendamento', [
      new TableColumn({
        name: 'secretaria_municipal_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
    await queryRunner.addColumns('agendamento', [
      new TableColumn({
        name: 'cidade_id',
        type: 'int',
        isNullable: true,
      }),
    ]);
    await queryRunner.createForeignKeys('agendamento', [
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    ]);
    await queryRunner.createForeignKey(
      'agendamento',
      new TableForeignKey({
        columnNames: ['cidade_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cidade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agendamento');
    await queryRunner.dropColumn('secretaria_municipal', 'gerenciamneto_id');
  }
}
