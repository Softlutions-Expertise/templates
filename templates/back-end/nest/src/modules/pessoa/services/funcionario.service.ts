import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { EscolaService } from '../../escola/services/escola.service';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { SecretariaMunicipalService } from '../../secretaria-municipal/secretaria-municipal.service';
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { FuncionarioDto } from '../dto/funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../entities/enums/pessoa.enum';
import { FuncionarioEntity } from '../entities/funcionario.entity';
import { PessoaService } from './pessoa.service';
import { UsuarioService } from './usuario.service';

@Injectable()
export class FuncionarioService {
  constructor(
    @Inject('FUNCIONARIO_REPOSITORY')
    private funcionarioRepository: Repository<FuncionarioEntity>,
    private readonly usuarioService: UsuarioService,
    private readonly pessoaService: PessoaService,
    private readonly secretariaService: SecretariaMunicipalService,
    private readonly unidadeEscolarService: EscolaService,
    private readonly databaseContextService: DatabaseContextService,
  ) {}

  async findOneByCpf(
    acessoControl: AcessoControl,
    cpfRaw: string,
  ): Promise<FuncionarioDto> {
    const cpf = LimparCpf(cpfRaw);

    const entity = await this.funcionarioRepository.findOne({
      where: {
        pessoa: { cpf: cpf },
      },
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },

        usuario: true,
      },
    });

    if (!entity) {
      throw new NotFoundException(`Funcionário não encontrado`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'servidor:read',
        null,
        entity.id,
      );
    }

    return { ...entity };
  }

  async findOne(
    acessoControl: AcessoControl,
    id: string,
  ): Promise<FuncionarioComEscola> {
    const entity = await this.funcionarioRepository.findOne({
      where: { id },
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },
        secretarias: true,
        unidadesEscolares: true,
        usuario: true,
      },
      order: {
        pessoa: {
          enderecos: { createdAt: 'DESC' },
        },
      },
    });

    if (!entity) {
      throw new NotFoundException(`Funcionário não encontrado.`);
    }
 
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget('servidor:read', null, id);
    }

    if (entity.tipoVinculo == TipoVinculoInstituicao.SecretariaMunicipal ) {
      const { secretarias, ...funcionarioData } = entity;


      return { funcionario: entity, secretarias: secretarias };
    } else if (entity.tipoVinculo == TipoVinculoInstituicao.UnidadeEscolar) {
      const { unidadesEscolares, ...funcionarioData } = entity;

      return { funcionario: entity, escolas: unidadesEscolares };
    }

    return { funcionario: entity };
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
    secretariaMunicipalId: string = null,
    unidadeEscolarId: string = null,
  ): Promise<Paginated<FuncionarioComInstituicao & { nomeInstituicao?: string }>> {
    const qb = this.funcionarioRepository.createQueryBuilder('funcionario') as SelectQueryBuilder<FuncionarioComInstituicao>;
    
   
    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction('servidor:read', qb);
  
    qb.leftJoinAndMapOne(
      'funcionario.nomeEscola',
      'funcionario.unidadesEscolares',
      'escola',
      'funcionario.tipoVinculo = :tipoVinculoEscola',
      { tipoVinculoEscola: TipoVinculoInstituicao.UnidadeEscolar },
    );
  
    qb.leftJoinAndMapOne(
      'funcionario.nomeSecretaria',
      'funcionario.secretarias',
      'secretaria',
      'funcionario.tipoVinculo = :tipoVinculoSecretaria',
      { tipoVinculoSecretaria: TipoVinculoInstituicao.SecretariaMunicipal },
    );
  
    if (secretariaMunicipalId) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('secretaria.id = :secretariaMunicipalId', { secretariaMunicipalId })
            .orWhere('escola.secretariaMunicipal.id = :secretariaMunicipalId', { secretariaMunicipalId });
        }),
      );
    }
  
    if (unidadeEscolarId) {
      qb.andWhere(
        'escola.id = :unidadeEscolarId AND funcionario.tipoVinculo = :tipoVinculoUnidadeEscolar',
        {
          unidadeEscolarId,
          tipoVinculoUnidadeEscolar: TipoVinculoInstituicao.UnidadeEscolar,
        },
      );
    }
  
    const result = await paginate<FuncionarioComInstituicao>(query, qb, {
      ...paginateConfig,
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'pessoa.nome',
        'pessoa.contato.emails',
        'pessoa.contato.telefones',
        'cargo',
        'usuario.usuario',
        'tipoVinculo',
      ],
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },
        secretarias: true,
        unidadesEscolares: true,
        usuario: true,
      },
    });
  
    result.data = result.data.map((funcionario) => {
      const { secretarias, ...funcionarioData } = funcionario;
      const nomeInstituicao = funcionario.nomeEscola || funcionario.nomeSecretaria || null;
      return {
        ...funcionarioData,
        nomeInstituicao,
        unidadesEscolares: funcionario.unidadesEscolares,
        secretarias,
      };
    });
    
    return result;
  }
  

  async create(
    acessoControl: AcessoControl,
    data: CreateFuncionarioDto,
  ): Promise<FuncionarioEntity> {
    data.id = undefined;

    // remover a mascara do cpf
    data.cpf = data.cpf?.replace(/\D/g, '');

    switch (data.nivelAcesso) {
      case NivelAcesso.Administrador:
      case NivelAcesso.Defensoria: {
        data.tipoVinculo = null;
        break;
      }
    }

 
    await acessoControl.ensureCanPerform('servidor:create', data);

    const pessoa = await this.pessoaService.create(acessoControl, data);
    const usuario = await this.usuarioService.createOrUpdate(data);

    const funcionario = this.funcionarioRepository.create({
      ...data,
      id: uuidv4(),
      pessoa: pessoa,
      usuario: usuario,
    });

    return this.funcionarioRepository.save(funcionario);
  }

  async update(
    acessoControl: AcessoControl,
    id: string,
    data: UpdateFuncionarioDto,
  ): Promise<FuncionarioEntity> {
    if (data.cpf) {
      data.cpf = LimparCpf(data.cpf);
    }

    switch (data.nivelAcesso) {
      case NivelAcesso.Administrador:
      case NivelAcesso.Defensoria: {
        data.tipoVinculo = null;
        break;
      }
    }

    await acessoControl.ensureCanReachTarget(
      'servidor:update',
      this.funcionarioRepository.createQueryBuilder('funcionario'),
      id,
      data,
    );

    const funcionario = await this.funcionarioRepository.findOne({
      where: { id },
      relations: {
        pessoa: {
          enderecos: true,
          contato: true,
        },

        usuario: true,
      },
      order: {
        pessoa: {
          enderecos: { createdAt: 'DESC' },
        },
      },
    });

    const pessoa = await this.pessoaService.update(
      acessoControl,
      funcionario.pessoa.id,
      data,
    );

    const usuario = await this.usuarioService.createOrUpdate(
      data,
      funcionario.usuario.id,
    );

    return this.funcionarioRepository.save(<FuncionarioEntity>{
      ...funcionario,
      ...data,
      id,
      pessoa: { id: pessoa.id },
      usuario: { id: usuario.id },
    });
  }

  async remove(acessoControl: AcessoControl, id: string): Promise<void> {
    const { funcionario } = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'servidor:delete',
      this.funcionarioRepository.createQueryBuilder('funcionario'),
      id,
    );

    const pessoa = await this.databaseContextService.pessoaRepository
      .createQueryBuilder('pessoa')
      .innerJoin('pessoa.funcionario', 'funcionario')
      .where('funcionario.id = :funcionarioId', {
        funcionarioId: funcionario.id,
      })
      .select('pessoa.id')
      .getOne();

    await this.funcionarioRepository.delete(id);

    await this.pessoaService.remove(pessoa.id);
  }
}

export interface FuncionarioComEscola {
  funcionario?: FuncionarioEntity;
  escolas?: EscolaEntity[];
  secretarias?: SecretariaMunicipalEntity[];
}
interface FuncionarioComInstituicao extends FuncionarioEntity {
  nomeEscola?: string;
  
  nomeSecretaria?: string;
}
