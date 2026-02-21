import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEntrevistaFkUnidadeIrmao1714490482215
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE 
        entrevista 
      SET 
        secretaria_municipal_irmao = REPLACE(REPLACE(secretaria_municipal_irmao, '{ "id": "', ''), '" }', '') 
      WHERE 
        secretaria_municipal_irmao LIKE '{ "id": "%'
  `);

    await queryRunner.query(`
  UPDATE 
    entrevista 
  SET 
    secretaria_municipal_irmao = REPLACE(REPLACE(secretaria_municipal_irmao, '{ "id":"', ''), '" }', '') 
  WHERE 
    secretaria_municipal_irmao LIKE '{ "id":"%'
`);

    await queryRunner.query(`
UPDATE 
  entrevista 
SET 
  secretaria_municipal_irmao = REPLACE(REPLACE(secretaria_municipal_irmao, '{"id":"', ''), '"}', '') 
WHERE 
  secretaria_municipal_irmao LIKE '{"id":"%'
`);

    await queryRunner.query(
      `alter table entrevista rename column secretaria_municipal_irmao to unidade_escolar_irmao_id;`,
    );

    await queryRunner.query(
      `alter table entrevista alter column unidade_escolar_irmao_id type uuid using unidade_escolar_irmao_id::uuid;`,
    );

    await queryRunner.query(
      `alter table entrevista add constraint entrevista_escola_id_fk foreign key (unidade_escolar_irmao_id) references escola;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table entrevista drop constraint if exists entrevista_escola_id_fk;`,
    );

    await queryRunner.query(
      `alter table entrevista alter column unidade_escolar_irmao_id type varchar;`,
    );

    await queryRunner.query(
      `alter table entrevista rename column unidade_escolar_irmao_id to secretaria_municipal_irmao;`,
    );
  }
}
