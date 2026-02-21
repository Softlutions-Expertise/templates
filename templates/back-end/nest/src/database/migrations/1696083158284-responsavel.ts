import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Responsavel1696083158284 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'responsavel',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nome_res',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cpf_res',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'data_nascimento_res',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'nacionalidade_res',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'registro_nascional_estrangeiro_res',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'protocolo_refugio_res',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sexo_res',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'parentesco',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'estado_civil',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'profissao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'falecido',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'reside_crianca',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'exerce_atividade_profissional',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'cep_local_trabalho_responsavel',
            isNullable: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('responsavel');
  }
}
