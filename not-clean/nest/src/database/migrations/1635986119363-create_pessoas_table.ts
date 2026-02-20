import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  Nacionalidade,
  Raca,
  Sexo,
} from '../../modules/pessoa/entities/enums/pessoa.enum';

export class CreatePessoasTable1635986119363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pessoa',
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
            name: 'nome',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '14',
            isNullable: true,
          },
          {
            name: 'rg',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'orgao_exp_rg',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'data_nascimento',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'sexo',
            type: 'enum',
            enum: Object.values(Sexo),
            isNullable: true,
          },
          {
            name: 'raca',
            type: 'enum',
            enum: Object.values(Raca),
            isNullable: true,
          },
          {
            name: 'nacionalidade',
            type: 'enum',
            isNullable: true,
            enum: Object.values(Nacionalidade),
            default: `'${Nacionalidade.Brasileira}'`,
          },
          {
            name: 'pais_nascimento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'uf_nascimento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'municipio_nascimento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'municipio_nascimento_id',
            type: 'varchar',
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pessoa');
  }
}
