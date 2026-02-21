import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  Categoria,
  Dependencia,
  Esfera,
  Regulamentacao,
  SituacaoFuncionamento,
  Unidade,
  Tipo,
  Conveniada,
} from '../../modules/escola/entities/enums/escola.enum';

export class CreateEscolaTable1664848537170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'escola',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'foto',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'codigo_inep',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'situacao_funcionamento',
            type: 'enum',
            enum: Object.values(SituacaoFuncionamento),
            isNullable: true,
          },
          {
            name: 'latitude',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'codigo_regional',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'nome_regional',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'dependencia_administrativa',
            type: 'enum',
            enum: Object.values(Dependencia),
            isNullable: true,
          },

          {
            name: 'categoria_escola_privada',
            type: 'enum',
            enum: Object.values(Categoria),
            isNullable: true,
          },

          {
            name: 'mantedora_escola_privada',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cnpj_mantedora_escola_privada',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cnpj_escola',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'regulamentacao',
            type: 'enum',
            enum: Object.values(Regulamentacao),
            isNullable: true,
          },
          {
            name: 'esfera_administrativa_conselho',
            type: 'enum',
            enum: Object.values(Esfera),
            isNullable: true,
          },
          {
            name: 'tipo_escola',
            type: 'enum',
            enum: Object.values(Tipo),
            isNullable: true,
          },
          {
            name: 'conveniada_poder_publico',
            type: 'enum',
            enum: Object.values(Conveniada),
            isNullable: true,
          },
          {
            name: 'data_criacao',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'denominacao_escola',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'autorizacao_funcionamento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'razao_social',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nome_fantasia',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'unidade_vinculada_escola',
            type: 'enum',
            enum: Object.values(Unidade),
            isNullable: true,
          },
          {
            name: 'codigo_escola_sede',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'codigo_instituicao_superior',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('escola');
  }
}
