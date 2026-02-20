import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { SituacaoFuncionamento } from '../../modules/escola/entities/enums/escola.enum';

export class UpdateSituacaoFuncionamentoInEscolaTable1759431247267
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('escola', 'situacao_funcionamento');

    await queryRunner.addColumn(
      'escola',
      new TableColumn({
        name: 'situacao_funcionamento',
        type: 'enum',
        enum: Object.values(SituacaoFuncionamento),
        isNullable: false,
        default: `'${SituacaoFuncionamento.desativada}'`,
      }),
    );

    await queryRunner.query(`
        UPDATE escola 
        SET situacao_funcionamento = '${SituacaoFuncionamento.ativa}'
        WHERE id IN (
            SELECT DISTINCT escola_id 
            FROM turma 
            WHERE escola_id IS NOT NULL
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('escola', 'situacao_funcionamento');

    await queryRunner.addColumn(
      'escola',
      new TableColumn({
        name: 'situacao_funcionamento',
        type: 'enum',
        enum: ['Ativa', 'Desativada'],
        isNullable: false,
        default: `'Ativa'`,
      }),
    );
  }
}
