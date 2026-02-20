import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContatoEntity } from '../../base/entities/contato.entity';
import { EnderecoEntity } from '../../base/entities/endereco.entity';
import { CriteriosConfiguracaoEntity } from '../../configuracao-criterio/entities/criterios-configuracao.entity';
import { CriteriosEntity } from '../../entrevista/entities/criterios.entity';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { SecretariaMunicipalEtapaEntity } from '../../secretaria-municipal-etapa/secretaria-municipal-etapa.entity';

@Entity('secretaria_municipal')
export class SecretariaMunicipalEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  logo!: string;

  @Column()
  cnpj!: string;

  @Column()
  razaoSocial!: string;

  @Column()
  nomeFantasia!: string;

  @Column()
  naturezaJuridica!: string;

  @Column()
  dataCriacao!: Date;

  @Column()
  decreto!: string;

  @Column()
  secretario!: string;

  @Column()
  vincEnteFederativo!: string;

  @Column()
  prefeito!: string;

  @Column()
  dataLimite!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => EnderecoEntity)
  endereco!: EnderecoEntity;

  @ManyToOne(() => ContatoEntity)
  contato!: ContatoEntity;

  @OneToMany(
    () => CriteriosConfiguracaoEntity,
    (configuracaoCriterio) => configuracaoCriterio.secretariaMunicipal,
    { cascade: true, onDelete: 'CASCADE' },
  )
  configuracoesCriterios!: CriteriosConfiguracaoEntity[];

  @OneToMany(() => EscolaEntity, (escola) => escola.secretariaMunicipal)
  escolas!: EscolaEntity[];

  //Adicionado apenas para possibilitar a deleção de critérios em cascata quando for deletada uma secretaria-municipal
  @OneToOne(() => CriteriosEntity, (criterio) => criterio.secretariaMunicipal, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  criterio: CriteriosEntity;

  @OneToMany(
    () => SecretariaMunicipalEtapaEntity,
    (secretariaMunicipalEtapa) => secretariaMunicipalEtapa.secretariaMunicipal,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  secretariaMunicipalEtapas: SecretariaMunicipalEtapaEntity[];

  @OneToMany(
    () => LocalAtendimentoEntity,
    (localAtendimento) => localAtendimento.secretariaMunicipal,
  )
  locaisAtendimentos: LocalAtendimentoEntity[];
}
