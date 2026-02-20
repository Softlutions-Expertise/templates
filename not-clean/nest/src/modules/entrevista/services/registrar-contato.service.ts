import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../../config/paginate.config';
import eventBus from '../../../helpers/eventEmitter.helper';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { CreateRegistrarContatoDto } from '../dto/create-registrar-contato.dto';
import { UpdateRegistrarContatoDto } from '../dto/update-registrar-contatos.dto';
import { EntrevistaEntity } from '../entities/entrevista.entity';
import { RegistrarContatoEntity } from '../entities/registrar-contato.entity';
import { ArquivoService } from '../../../infrastructure/arquivo/arquivo.service';

@Injectable()
export class RegistrarContatoService {
  constructor(
    @Inject('REGISTRO_CONTATO_REPOSITORY')
    private repository: Repository<RegistrarContatoEntity>,
    @Inject('ENTREVISTA_REPOSITORY')
    private repositoryEntrevista: Repository<EntrevistaEntity>,
    private readonly arquivoService: ArquivoService,
    
  ) {}

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<RegistrarContatoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Contato não encontrado`);
    }

    const qb = this.repository.createQueryBuilder('registro_contato');

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'registro_contato:read',
        qb,
        entity.id,
      );
    }

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
  ): Promise<Paginated<RegistrarContatoEntity>> {
    const qb = this.repository.createQueryBuilder('registro_contato');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'registro_contato:read',
        qb,
      );
    }

    return paginate(query, qb, {
      ...paginateConfig,
      defaultSortBy: [['id', 'DESC']],
    });
  }

  private getDateTimeFila(date) {
    const datahoraFila = new Date(date);
    const options = { timeZone: 'America/Porto_Velho', hour12: false };

    const dataFila = datahoraFila.toLocaleDateString('pt-BR', options);
    const horaFila = datahoraFila.toLocaleTimeString('pt-BR', options);

    return { dataFila, horaFila };
  }

  async create(
    acessoControl: AcessoControl | null,
    idUnidadeEscolar: string,
    turno: string,
    data: CreateRegistrarContatoDto,
  ) {
    if (acessoControl) {
      await acessoControl.ensureCanPerform('registro_contato:create', data);
    }
    data.id = undefined;
    data.id = uuidv4();

    if (data.comprovante) {
      const filePath = await this.arquivoService.uploadRegistroContato(
        acessoControl,
        data.id,
        data.comprovante,
      );

      data.comprovante = filePath;
    }


    const _data = this.repository.create({
      ...data,
      id: uuidv4(),
    });

    if (data.ligacaoAceita === 'Vaga Recusada') {
      const entrevista = await this.repositoryEntrevista.findOne({
        where: { id: data.entrevista.id },
      });

      const date = this.getDateTimeFila(data.dataContato);

      if ((idUnidadeEscolar === entrevista.preferenciaUnidade.id) && (turno === entrevista.preferenciaTurno)) {
        entrevista.elegivelParaFila = false;
        entrevista.observacoesCentralVagas = `${
          entrevista.observacoesCentralVagas || ''
        }\nVaga Recusada na creche ${
          entrevista.preferenciaUnidade.nomeFantasia
        } no turno ${entrevista.preferenciaTurno} no dia 
        ${date.dataFila} às ${date.horaFila} por ${
          data.nomeContato
        } feito por ${data.tipoContato}`;
      }
      else if (
        (idUnidadeEscolar === entrevista.preferenciaUnidade2.id) &&
        (turno === entrevista.preferenciaTurno2)
      ) {
        entrevista.elegivelParaFila2 = false;
        entrevista.observacoesCentralVagas = `${
          entrevista.observacoesCentralVagas || ''
        }\nVaga Recusada na creche ${
          entrevista.preferenciaUnidade2.nomeFantasia
        } no turno ${entrevista.preferenciaTurno2} no dia 
        ${date.dataFila} às ${date.horaFila} por ${
          data.nomeContato
        } feito por ${data.tipoContato}`;
      }
      else {
        throw new NotFoundException(
          `A unidade escolar ou turno informado não corresponde à entrevista.`,
        );
      }

      await this.repositoryEntrevista.save(entrevista);

      if (
        entrevista.etapa &&
        ((entrevista.preferenciaUnidade && entrevista.preferenciaTurno) ||
          (entrevista.preferenciaUnidade2 && entrevista.preferenciaTurno2))
      ) {
        eventBus.emit('criarFila', entrevista);
      }
    }

    return this.repository.save(_data);
  }

  async update(
    acessoControl: AcessoControl | null,
    id: string,
    dto: UpdateRegistrarContatoDto,
  ): Promise<RegistrarContatoEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'registro_contato:update',
        this.repository.createQueryBuilder('registro_contato'),
        id,
        dto,
      );
    }

    const entity = await this.findOne(acessoControl, id);

    return this.repository.save({
      ...entity,
      ...dto,
    });
  }

  async remove(acessoControl: AcessoControl | null, id: string) {
    const registroContato = await this.findOne(acessoControl, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'registro_contato:delete',
        this.repository.createQueryBuilder('registro_vaga'),
        registroContato.id,
      );
    }

    return this.repository.delete(id);
  }
}
