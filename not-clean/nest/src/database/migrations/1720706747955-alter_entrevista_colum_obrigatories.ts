import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterEntrevistaColumObrigatories1720706747955 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
          'entrevista',
          'membros_edereco_crianca',
          new TableColumn({
            name: 'membros_edereco_crianca',
            type: 'varchar',
            isNullable: true,
          })
        );
    
        await queryRunner.changeColumn(
          'entrevista',
          'membros_contribuintes_renda',
          new TableColumn({
            name: 'membros_contribuintes_renda',
            type: 'varchar',
            isNullable: true,
          })
        );
    
        await queryRunner.changeColumn(
          'entrevista',
          'valor_renda_familiar',
          new TableColumn({
            name: 'valor_renda_familiar',
            type: 'varchar',
            isNullable: true,
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
          'entrevista',
          'membros_edereco_crianca',
          new TableColumn({
            name: 'membros_edereco_crianca',
            type: 'varchar',
            isNullable: false,
          })
        );
    
        await queryRunner.changeColumn(
          'entrevista',
          'membros_contribuintes_renda',
          new TableColumn({
            name: 'membros_contribuintes_renda',
            type: 'varchar',
            isNullable: false,
          })
        );
    
        await queryRunner.changeColumn(
          'entrevista',
          'valor_renda_familiar',
          new TableColumn({
            name: 'valor_renda_familiar',
            type: 'varchar',
            isNullable: false,
          })
        );
      }

}
