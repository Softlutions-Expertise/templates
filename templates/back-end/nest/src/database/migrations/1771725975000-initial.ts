import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class Initial1771725975000 implements MigrationInterface {
  name = 'Initial1771725975000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==========================================================
    // Tabela: estado
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'base_estado',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'nome', type: 'varchar', isNullable: false },
          { name: 'uf', type: 'varchar', length: '2', isNullable: false },
        ],
      }),
      true,
    );

    // ==========================================================
    // Tabela: cidade
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'base_cidade',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'nome', type: 'varchar', isNullable: false },
          { name: 'estado_id', type: 'varchar', isNullable: false },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'base_cidade',
      new TableForeignKey({
        columnNames: ['estado_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_estado',
        onDelete: 'CASCADE',
      }),
    );

    // ==========================================================
    // Tabela: contato
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'base_contato',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'telefones', type: 'text', isNullable: true },
          { name: 'emails', type: 'text', isNullable: true },
        ],
      }),
      true,
    );

    // ==========================================================
    // Tabela: endereco
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'base_endereco',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'logradouro', type: 'varchar', isNullable: false },
          { name: 'numero', type: 'integer', isNullable: false },
          { name: 'bairro', type: 'varchar', isNullable: false },
          { name: 'complemento', type: 'varchar', isNullable: true },
          { name: 'ponto_referencia', type: 'varchar', isNullable: true },
          { name: 'cep', type: 'varchar', isNullable: false },
          { name: 'localizacao_diferenciada', type: 'enum', enum: ['Nao', 'AreaAssentamento', 'ComunidadeQuilombola', 'ComunidadeIndigena', 'ComunidadeTradicional'], isNullable: true },
          { name: 'zona', type: 'enum', enum: ['Urbana', 'Rural'], isNullable: true },
          { name: 'cidade_id', type: 'varchar', isNullable: true },
          { name: 'latitude', type: 'varchar', isNullable: true },
          { name: 'longitude', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'base_endereco',
      new TableForeignKey({
        columnNames: ['cidade_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_cidade',
        onDelete: 'SET NULL',
      }),
    );

    // ==========================================================
    // Tabela: log_coordenada
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'base_log_coordenada',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'endereco', type: 'varchar', isNullable: false },
          { name: 'latitude', type: 'varchar', isNullable: false },
          { name: 'longitude', type: 'varchar', isNullable: false },
          { name: 'servico', type: 'enum', enum: ['GoogleMaps', 'OpenStreetMap'], isNullable: false },
          { name: 'motivo', type: 'enum', enum: ['CadastroEndereco', 'CorrecaoLatLong', 'Outro'], isNullable: false, default: "'Outro'" },
          { name: 'usuario_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );

    // ==========================================================
    // Tabela: pessoa
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'pessoa',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'nome', type: 'varchar', isNullable: false },
          { name: 'foto', type: 'varchar', isNullable: true },
          { name: 'cpf', type: 'varchar', length: '11', isNullable: false, isUnique: true },
          { name: 'rg', type: 'varchar', isNullable: false },
          { name: 'orgao_exp_rg', type: 'varchar', isNullable: false },
          { name: 'data_nascimento', type: 'date', isNullable: false },
          { name: 'sexo', type: 'enum', enum: ['Masculino', 'Feminino', 'Outro'], isNullable: false },
          { name: 'raca', type: 'enum', enum: ['Branca', 'Preta', 'Parda', 'Amarela', 'Indigena', 'NaoDeclarada'], isNullable: false },
          { name: 'nacionalidade', type: 'enum', enum: ['Brasileira', 'Estrangeira', 'BrasileiraNaturalizada'], isNullable: true },
          { name: 'pais_nascimento', type: 'varchar', isNullable: false },
          { name: 'uf_nascimento', type: 'varchar', length: '2', isNullable: false },
          { name: 'municipio_nascimento', type: 'varchar', isNullable: false },
          { name: 'municipio_nascimento_id', type: 'varchar', isNullable: true },
          { name: 'contato_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'pessoa',
      new TableForeignKey({
        columnNames: ['contato_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_contato',
        onDelete: 'SET NULL',
      }),
    );

    // ==========================================================
    // Tabela: pessoa_endereco (relacionamento N:N)
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'pessoa_endereco',
        columns: [
          { name: 'pessoa_id', type: 'uuid', isPrimary: true },
          { name: 'endereco_id', type: 'uuid', isPrimary: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'pessoa_endereco',
      new TableForeignKey({
        columnNames: ['pessoa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pessoa',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'pessoa_endereco',
      new TableForeignKey({
        columnNames: ['endereco_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'base_endereco',
        onDelete: 'CASCADE',
      }),
    );

    // ==========================================================
    // Tabela: usuario
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'usuario', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'senha', type: 'varchar', isNullable: false },
          { name: 'nivel_acesso', type: 'enum', enum: ['Administrador', 'Gestor', 'Analista', 'Operador'], isNullable: false },
          { name: 'ativo', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    // ==========================================================
    // Tabela: colaborador (antigo funcionario)
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'colaborador',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'pessoa_id', type: 'uuid', isNullable: false },
          { name: 'usuario_id', type: 'uuid', isNullable: false },
          { name: 'nivel_escolaridade', type: 'enum', enum: ['EnsinoFundamentalIncompleto', 'EnsinoFundamentalCompleto', 'EnsinoMedioIncompleto', 'EnsinoMedioCompleto', 'SuperiorIncompleto', 'SuperiorCompleto', 'PosGraduacao', 'Mestrado', 'Doutorado'], isNullable: true },
          { name: 'tipo_ensino_medio', type: 'enum', enum: ['FormacaoGeral', 'ModalidadeNormal', 'CursoTecnico', 'MagisterioIndigena'], isNullable: true },
          { name: 'pos_graduacao_concluida', type: 'enum', enum: ['Especializacao', 'Mestrado', 'Doutorado', 'NaoTemPos'], isNullable: true },
          { name: 'cargo', type: 'enum', enum: ['AdministradorSistema', 'Gestor', 'Analista', 'Operador', 'Outro'], isNullable: true },
          { name: 'tipo_vinculo', type: 'enum', enum: ['Interno', 'Externo'], isNullable: true },
          { name: 'instituicao_id', type: 'varchar', isNullable: true },
          { name: 'instituicao_nome', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'colaborador',
      new TableForeignKey({
        columnNames: ['pessoa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pessoa',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'colaborador',
      new TableForeignKey({
        columnNames: ['usuario_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'usuario',
        onDelete: 'CASCADE',
      }),
    );

    // ==========================================================
    // Tabela: arquivo
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'arquivo',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'nome_arquivo', type: 'varchar', isNullable: false },
          { name: 'tipo_arquivo', type: 'varchar', isNullable: false },
          { name: 'name_size_file', type: 'varchar', isNullable: false },
          { name: 'byte_string', type: 'text', isNullable: false },
          { name: 'access_token', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    // ==========================================================
    // Tabela: integration_access_token
    // ==========================================================
    await queryRunner.createTable(
      new Table({
        name: 'integration_access_token',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'token', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'descricao', type: 'varchar', isNullable: true },
          { name: 'ativo', type: 'boolean', default: true },
          { name: 'expires_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    // ==========================================================
    // Índices
    // ==========================================================
    await queryRunner.createIndex('pessoa', new TableIndex({ columnNames: ['cpf'] }));
    await queryRunner.createIndex('usuario', new TableIndex({ columnNames: ['usuario'] }));
    await queryRunner.createIndex('colaborador', new TableIndex({ columnNames: ['pessoa_id'] }));
    await queryRunner.createIndex('colaborador', new TableIndex({ columnNames: ['usuario_id'] }));
    await queryRunner.createIndex('base_endereco', new TableIndex({ columnNames: ['cidade_id'] }));

    console.log('✅ Migration inicial executada com sucesso!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Ordem inversa para remoção
    await queryRunner.dropTable('integration_access_token', true);
    await queryRunner.dropTable('arquivo', true);
    await queryRunner.dropTable('colaborador', true);
    await queryRunner.dropTable('usuario', true);
    await queryRunner.dropTable('pessoa_endereco', true);
    await queryRunner.dropTable('pessoa', true);
    await queryRunner.dropTable('base_log_coordenada', true);
    await queryRunner.dropTable('base_endereco', true);
    await queryRunner.dropTable('base_contato', true);
    await queryRunner.dropTable('base_cidade', true);
    await queryRunner.dropTable('base_estado', true);
  }
}
