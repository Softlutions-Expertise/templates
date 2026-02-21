import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  NivelEscolaridade,
  PosGraduacaoConcluida,
  TipoEnsinoMedio,
  TipoVinculoInstituicao,
} from '../../modules/pessoa/entities/enums/pessoa.enum';

export class CreateFuncionarioTable1667507717896 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pessoa_funcionario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nivel_escolaridade',
            type: 'enum',
            isNullable: true,
            enum: Object.values(NivelEscolaridade),
          },
          {
            name: 'tipo_ensino_medio',
            type: 'enum',
            isNullable: true,
            enum: Object.values(TipoEnsinoMedio),
          },
          {
            name: 'pos_graduacao_concluida',
            type: 'enum',
            isNullable: true,
            enum: Object.values(PosGraduacaoConcluida),
          },
          {
            name: 'tipo_vinculo',
            type: 'enum',
            enum: Object.values(TipoVinculoInstituicao),
            isNullable: true,
          },
          {
            name: 'possui_deficiencias',
            type: 'bool',
            default: false,
          },
          {
            name: 'cargo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pessoa_id',
            type: 'uuid',
          },
          {
            name: 'instituicao_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'usuario_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['pessoa_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'pessoa',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoa_funcionario');
  }
}
