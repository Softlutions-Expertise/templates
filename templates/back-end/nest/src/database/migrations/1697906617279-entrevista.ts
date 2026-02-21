import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Entrevista1697906617279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'entrevista',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'data_entrevista',
            type: 'timestamp',
          },
          {
            name: 'horario_agendamento',
            type: 'varchar',
          },
          {
            name: 'etapa',
            type: 'varchar',
          },
          {
            name: 'preferencia_turno',
            type: 'varchar',
          },
          {
            name: 'tipo_responsavel',
            type: 'varchar',
          },
          {
            name: 'nome_responsavel',
            type: 'varchar',
          },
          {
            name: 'cpf_responsavel',
            type: 'varchar',
          },
          {
            name: 'data_nascimento_responsavel',
            type: 'timestamp',
          },
          {
            name: 'sexo_responsavel',
            type: 'varchar',
          },
          {
            name: 'estado_civil_responsavel',
            type: 'varchar',
          },
          {
            name: 'preferencia_unidade',
            type: 'uuid',
          },
          {
            name: 'preferencia_unidade2',
            isNullable: true,
            type: 'uuid',
          },
          {
            name: 'possui_irmao_na_unidade',
            type: 'bool',
          },
          {
            name: 'nome_irmao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cpf_irmao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'secretaria_municipal_irmao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'criterios',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'membros_edereco_crianca',
            type: 'varchar',
          },
          {
            name: 'membros_contribuintes_renda',
            type: 'varchar',
          },
          {
            name: 'valor_renda_familiar',
            type: 'varchar',
          },
          {
            name: 'observacoes_familia',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observacoes_central_vagas',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'crianca_id',
            type: 'uuid',
          },
          {
            name: 'entrevistador',
            type: 'uuid',
          },
        ],
      }),
    );
    await queryRunner.addColumns('entrevista', [
      new TableColumn({
        name: 'secretaria_municipal_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('entrevista', [
      new TableForeignKey({
        columnNames: ['secretaria_municipal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secretaria_municipal',
      }),
    ]);

    await queryRunner.createForeignKeys('entrevista', [
      new TableForeignKey({
        columnNames: ['entrevistador'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pessoa_funcionario',
      }),
    ]);

    await queryRunner.createForeignKeys('entrevista', [
      new TableForeignKey({
        columnNames: ['preferencia_unidade'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola',
      }),
    ]);

    await queryRunner.createForeignKeys('entrevista', [
      new TableForeignKey({
        columnNames: ['preferencia_unidade2'],
        referencedColumnNames: ['id'],
        referencedTableName: 'escola',
      }),
    ]);

    await queryRunner.createForeignKeys('entrevista', [
      new TableForeignKey({
        columnNames: ['crianca_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crianca',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('entrevista');
  }
}
