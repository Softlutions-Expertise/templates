import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LimparCpf } from '../../../helpers/functions/Mask';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ArquivoService } from '../../../infrastructure/arquivo/arquivo.service';
import { CidadeEntity } from '../../base/entities/cidade.entity';
import { ContatoService } from '../../base/services/contato.service';
import { EnderecoService } from '../../base/services/endereco.service';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';
import { UpdatePessoaDto } from '../dto/update-pessoa.dto';
import { PessoaEntity } from '../entities/pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @Inject('PESSOA_REPOSITORY')
    private pessoaRepository: Repository<PessoaEntity>,
    @Inject('CIDADE_REPOSITORY')
    private cidadeRepository: Repository<CidadeEntity>,
    private readonly contatoService: ContatoService,
    private readonly enderecoService: EnderecoService,
    private readonly arquivoService: ArquivoService,
  ) {}

  async findOne(id: string): Promise<PessoaEntity> {
    const entity = await this.pessoaRepository.findOne({
      where: { id },
      relations: { enderecos: true, contato: true },
      order: { enderecos: { createdAt: 'DESC' } },
    });

    if (!entity) {
      throw new NotFoundException(`Pessoa not found`);
    }

    return entity;
  }

  async create(
    acessoControl: AcessoControl | null,
    data: CreatePessoaDto,
  ): Promise<PessoaEntity> {
    data.id = undefined;
    data.id = uuidv4();
    const endereco = await this.enderecoService.create(data.endereco);
    const contato = await this.contatoService.create(data);
    const cidade = await this.cidadeRepository.findOne({
      where: { nome: data.municipioNascimento },
    });

    data.cpf = LimparCpf(data.cpf);
    data.municipioNascimentoId = cidade.id.toString();

    delete data.endereco;
    delete data.contato;

    if (data.foto) {
      const filePath = await this.arquivoService.uploadProfilePictureFromBase64(
        acessoControl,
        data.id,
        data.foto,
      );

      data.foto = filePath;
    }

    return this.pessoaRepository.save({
      ...data,
      contato: contato,
      enderecos: [endereco],
    });
  }

  async update(
    acessoControl: AcessoControl | null,
    id: string,
    data: UpdatePessoaDto,
  ) {
    if (data.cpf) {
      data.cpf = LimparCpf(data.cpf);
    }

    const { contato, ...pessoa } = await this.findOne(id);

    if (data.foto) {
      const accessToken =
        await this.arquivoService.uploadProfilePictureFromBase64(
          acessoControl,
          id,
          data.foto,
        );

      data.foto = accessToken;
    }

    const entity = await this.pessoaRepository.preload({
      ...data,
      id: pessoa.id,
      updatedAt: new Date(),
    });

    if (data.contato !== undefined && data.contato !== null)
      entity.contato = await this.contatoService.createOrUpdate(
        data,
        contato.id,
      );

    return this.pessoaRepository.save(entity);
  }

  async remove(id: string) {
    await this.pessoaRepository.delete(id);
  }
}
