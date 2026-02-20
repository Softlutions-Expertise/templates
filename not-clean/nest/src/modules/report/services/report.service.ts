import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { CriteriosEntity } from '../../entrevista/entities/criterios.entity';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { TurmaEntity } from '../../escola/entities/turma.entity';
import { EtapaEntity } from '../../etapa/etapa.entity';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { reportConfig } from '../report.config';

@Injectable()
export class ReportService {
  constructor(
    @Inject('SECRETARIA_MUNICIPAL_REPOSITORY')
    private secretariaMunicipalRepository: Repository<SecretariaMunicipalEntity>,
    @Inject('LOCAL_ATENDIMENTO_REPOSITORY')
    private localAtendimentoRepository: Repository<LocalAtendimentoEntity>,
    @Inject('ESCOLA_REPOSITORY')
    private escolaRepository: Repository<EscolaEntity>,
    @Inject('ETAPA_REPOSITORY')
    private readonly etapaRepository: Repository<EtapaEntity>,
    @Inject('TURMA_REPOSITORY')
    private turmaRepository: Repository<TurmaEntity>,
    @Inject('FUNCIONARIO_REPOSITORY')
    private funcionarioRepository: Repository<FuncionarioEntity>,
    @Inject('CRITERIOS_REPOSITORY')
    private criteriosRepository: Repository<CriteriosEntity>,
    private readonly moduleRef: ModuleRef,
  ) { }

  /**
   * Função genérica para carregar dinamicamente o serviço com base no nome.
   * @param serviceName - Nome da classe do serviço, conforme definido no report.config.
   */
  private async getServiceInstance(serviceName: string): Promise<any> {
    try {
      const modulePath = `./${this.convertToFileName(serviceName)}`;
      const serviceModule = await import(modulePath);
      const ServiceClass = serviceModule[serviceName];

      if (!ServiceClass) {
        throw new Error(`Serviço ${serviceName} não encontrado.`);
      }

      return this.moduleRef.get(ServiceClass, { strict: false });
    } catch (error) {
      throw new BadRequestException(
        `Erro ao carregar o serviço ${serviceName}.`,
      );
    }
  }

  /**
   * Converte o nome da classe para o nome do arquivo correspondente.
   * @param serviceName - Nome da classe.
   */
  private convertToFileName(serviceName: string): string {
    return (
      serviceName
        .replace(/Service/, '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase() + '.service'
    );
  }

  /**
   * Gera um relatório com base no tipo e nos parâmetros recebidos.
   * @param reportType - Tipo de relatório.
   * @param query - Parâmetros recebidos na requisição.
   */
  async generateReport(
    acessoControl: AcessoControl,
    reportType: string,
    query: any,
  ) {
    const report = reportConfig.find((r) => r.type === reportType);

    if (!report) {
      throw new BadRequestException(
        `Relatório do tipo ${reportType} não encontrado.`,
      );
    }

    const serviceInstance = await this.getServiceInstance(report.serviceName);

    let secretariaMunicipal = null;
    let localAtendimento = null;
    let escola = null;
    let etapa = null;
    let turma = null;

    if (query.secretariaMunicipalId) {
      secretariaMunicipal = await this.getMetadataSecretariaMunicipal(
        query.secretariaMunicipalId,
      );
    }
    if (query.localAtendimentoId) {
      localAtendimento = await this.getMetadataLocalAtendimento(
        query.localAtendimentoId,
      );
    } else if (query.secretariaMunicipalId && !query.localAtendimentoId) {
      // Try to fetch a representative localAtendimento for this secretariaMunicipal
      // This helps maintain compatibility when only secretariaMunicipalId is provided
      const representativeLocal = await this.localAtendimentoRepository.findOne({
        where: { secretariaMunicipal: { id: query.secretariaMunicipalId } },
        relations: ['endereco', 'endereco.cidade', 'endereco.cidade.estado', 'contato', 'secretariaMunicipal'],
      });

      if (representativeLocal) {
        localAtendimento = {
          id: representativeLocal.id,
          nome: representativeLocal.nome,
          ativo: representativeLocal.ativo,
          endereco: representativeLocal.endereco ? {
            logradouro: representativeLocal.endereco.logradouro,
            numero: representativeLocal.endereco.numero,
            complemento: representativeLocal.endereco.complemento,
            bairro: representativeLocal.endereco.bairro,
            cep: representativeLocal.endereco.cep,
            cidade: representativeLocal.endereco.cidade?.nome,
            estado: representativeLocal.endereco.cidade?.estado?.nome,
          } : null,
          contato: representativeLocal.contato ? {
            telefones: representativeLocal.contato.telefones,
            emails: representativeLocal.contato.emails,
          } : null,
          secretariaMunicipal: representativeLocal.secretariaMunicipal ? {
            id: representativeLocal.secretariaMunicipal.id,
            nomeFantasia: representativeLocal.secretariaMunicipal.nomeFantasia,
            razaoSocial: representativeLocal.secretariaMunicipal.razaoSocial,
            cnpj: representativeLocal.secretariaMunicipal.cnpj,
          } : null,
        };
      }
    }
    if (query.unidadeEscolarId) {
      escola = await this.getMetadataEscola(query.unidadeEscolarId);
    }

    await acessoControl.ensureCanPerform('report:check', {
      unidadeEscolar: query.unidadeEscolarId,
      secretariaMunicipal: query.secretariaMunicipalId,
    });

    if (query.etapaId) {
      etapa = await this.getMetadataEtapa(query.etapaId);
    }
    if (query.turmaId) {
      turma = await this.getMetadataTurma(query.turmaId);
    }
    if (query.entrevistadorId) {
      query.entrevistador = await this.getFilterEntrevistador(
        query.entrevistadorId,
      );
    }
    if (query.preferredGroups) {
      query.criterios = await this.getFilterCriterios(query.preferredGroups);
    }

    const reportData = await serviceInstance.execute(query);

    const reportMetadata = {
      secretariaMunicipal,
      localAtendimento,
      escola,
      etapa,
      turma,
      usuario: {
        nome: acessoControl.currentFuncionario.pessoa.nome,
        cpf: acessoControl.currentFuncionario.pessoa.cpf,
        cargo: acessoControl.currentFuncionario.cargo,
        nivelAcesso: acessoControl.currentFuncionario.usuario.nivelAcesso,
      },
      filters: query,
      dateTime: new Date(),
    };

    const data = {
      title: report.title,
      metadata: reportMetadata,
      data: reportData,
    };

    return data;
  }

  private async getMetadataSecretariaMunicipal(secretariaMunicipalId: string) {
    const secretariaMunicipal =
      await this.secretariaMunicipalRepository.findOne({
        where: { id: secretariaMunicipalId },
      });

    if (!secretariaMunicipal) {
      throw new BadRequestException(
        `Secretaria Municipal com ID ${secretariaMunicipalId} não encontrada.`,
      );
    }

    const data = {
      id: secretariaMunicipal.id,
      nomeFantasia: secretariaMunicipal.nomeFantasia,
      razaoSocial: secretariaMunicipal.razaoSocial,
      cnpj: secretariaMunicipal.cnpj,
    };

    return data;
  }

  private async getMetadataEscola(unidadeEscolarId: string) {
    const escola = await this.escolaRepository.findOne({
      where: { id: unidadeEscolarId },
    });

    if (!escola) {
      throw new BadRequestException(
        `Escola com ID ${unidadeEscolarId} não encontrada.`,
      );
    }

    const data = {
      id: escola.id,
      nomeFantasia: escola.nomeFantasia,
      razaoSocial: escola.razaoSocial,
      cnpj: escola.cnpjEscola,
    };

    return data;
  } private async getMetadataLocalAtendimento(localAtendimentoId: string) {
    const localAtendimento = await this.localAtendimentoRepository.findOne({
      where: { id: localAtendimentoId },
      relations: ['endereco', 'endereco.cidade', 'endereco.cidade.estado', 'contato', 'secretariaMunicipal'],
    });

    if (!localAtendimento) {
      throw new BadRequestException(
        `Local de Atendimento com ID ${localAtendimentoId} não encontrado.`,
      );
    }

    const data = {
      id: localAtendimento.id,
      nome: localAtendimento.nome,
      ativo: localAtendimento.ativo,
      endereco: localAtendimento.endereco ? {
        logradouro: localAtendimento.endereco.logradouro,
        numero: localAtendimento.endereco.numero,
        complemento: localAtendimento.endereco.complemento,
        bairro: localAtendimento.endereco.bairro,
        cep: localAtendimento.endereco.cep,
        cidade: localAtendimento.endereco.cidade?.nome,
        estado: localAtendimento.endereco.cidade?.estado?.nome,
      } : null,
      contato: localAtendimento.contato ? {
        telefones: localAtendimento.contato.telefones,
        emails: localAtendimento.contato.emails,
      } : null,
      secretariaMunicipal: localAtendimento.secretariaMunicipal ? {
        id: localAtendimento.secretariaMunicipal.id,
        nomeFantasia: localAtendimento.secretariaMunicipal.nomeFantasia,
        razaoSocial: localAtendimento.secretariaMunicipal.razaoSocial,
        cnpj: localAtendimento.secretariaMunicipal.cnpj,
      } : null,
    };

    return data;
  }

  private async getMetadataEtapa(etapaId: string) {
    const estapaIdInt = parseInt(etapaId);
    const etapa = await this.etapaRepository.findOne({
      where: { id: estapaIdInt },
    });

    if (!etapa) {
      throw new BadRequestException(`Etapa com ID ${etapaId} não encontrada.`);
    }

    const data = {
      id: etapa.id,
      nome: etapa.nome,
    };

    return data;
  }

  private async getMetadataTurma(turmaId: string) {
    const turma = await this.turmaRepository.findOne({
      where: { id: turmaId },
    });

    if (!turma) {
      throw new BadRequestException(`Turma com ID ${turmaId} não encontrada.`);
    }

    const data = {
      id: turma.id,
      nome: turma.nome,
    };

    return data;
  }

  private async getFilterEntrevistador(entrevistadorId: string) {
    const entrevistador = await this.funcionarioRepository.findOne({
      where: { id: entrevistadorId },
      relations: ['pessoa'],
    });

    if (!entrevistador) {
      throw new BadRequestException(
        `Entrevistador com ID ${entrevistadorId} não encontrado.`,
      );
    }

    const data = {
      id: entrevistador.id,
      nome: entrevistador.pessoa.nome,
      cpf: entrevistador.pessoa.cpf,
    };

    return data;
  }

  private async getFilterCriterios(preferredGroups: string) {
    const grupos = preferredGroups.split(',');

    const criterios = await Promise.all(
      grupos.map(async (grupo) => {
        const criterio = await this.criteriosRepository.findOne({
          where: { id: grupo },
        });

        if (!criterio) {
          throw new BadRequestException(`Critério ${grupo} não encontrado.`);
        }

        return {
          id: criterio.id,
          nome: criterio.nome,
        };
      }),
    );

    return criterios;
  }
}
