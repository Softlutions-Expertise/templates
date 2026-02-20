import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

enum NivelAcesso {
  Administrador = 'Administrador',
  AdministradorMunicipal = 'Administrador Municipal',
  AtendenteSecretaria = 'Atendente Secretaria',
  GestorCreche = 'Gestor de Creche',
}

export class AddTableUsusario1688410480363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'nivel_acesso',
            type: 'enum',
            enum: Object.values(NivelAcesso),
            isNullable: false,
          },
          {
            name: 'situacao_cadastral',
            type: 'boolean',
            default: true,
            isNullable: true,
          },
          {
            name: 'usuario',
            type: 'varchar',
            isNullable: false,
          },
          { name: 'senha', type: 'varchar', isNullable: false },
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
    await queryRunner.createForeignKey(
      'pessoa_funcionario',
      new TableForeignKey({
        columnNames: ['usuario_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'usuario',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('pessoa_funcionario', 'usuario_id');
    await queryRunner.dropTable('usuario');
  }
}
