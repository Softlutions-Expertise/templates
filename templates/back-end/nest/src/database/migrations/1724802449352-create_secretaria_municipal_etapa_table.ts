import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class CreateSecretariaMunicipalEtapaTable1724802449352
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'secretaria_municipal_etapa',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'data_limite',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'idade_inicial',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'idade_final',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'ativa',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'secretaria_municipal_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'etapa_id',
            type: 'int',
            isNullable: false,
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
        foreignKeys: [
          {
            columnNames: ['secretaria_municipal_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'secretaria_municipal',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['etapa_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'etapa',
          },
        ],
      }),
    );

    const secretarias = await queryRunner.query(
      `SELECT id FROM secretaria_municipal`,
    );

    const etapas = [
      {
        id: 1,
        data_limite: '03-31',
        idade_inicial: 0,
        idade_final: 0.6,
      }, // Berçário I
      {
        id: 2,
        data_limite: '03-31',
        idade_inicial: 0.7,
        idade_final: 1.6,
      }, // Berçário II
      {
        id: 3,
        data_limite: '03-31',
        idade_inicial: 1.7,
        idade_final: 2.11,
      }, // Maternal I
      {
        id: 4,
        data_limite: '03-31',
        idade_inicial: 3,
        idade_final: 3.11,
      }, // Maternal II
      {
        id: 5,
        data_limite: '03-31',
        idade_inicial: 4,
        idade_final: 4.11,
      }, // Pré I
      {
        id: 6,
        data_limite: '03-31',
        idade_inicial: 5,
        idade_final: 5.11,
      }, // Pré II
    ];

    for (const secretaria of secretarias) {
      for (const etapa of etapas) {
        const id = uuidv4();
        await queryRunner.query(
          `INSERT INTO secretaria_municipal_etapa (id, data_limite, idade_inicial, idade_final, secretaria_municipal_id, etapa_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [
            id,
            etapa.data_limite,
            etapa.idade_inicial,
            etapa.idade_final,
            secretaria.id,
            etapa.id,
          ],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('secretaria_municipal_etapa');
  }
}
