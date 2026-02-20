import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EtapaService } from '../etapa/etapa.service';
import { SecretariaMunicipalService } from '../secretaria-municipal/secretaria-municipal.service';
import { CreateSecretariaMunicipalEtapaDto } from './dto/create-secretaria-municipal-etapa.dto';
import { UpdateSecretariaMunicipalEtapaDto } from './dto/update-secretaria-municipal-etapa.dto';
import { SecretariaMunicipalEtapaEntity } from './secretaria-municipal-etapa.entity';

@Injectable()
export class SecretariaMunicipalEtapaService {
  constructor(
    @Inject('SECRETARIA_MUNICIPAL_ETAPA_REPOSITORY')
    private repository: Repository<SecretariaMunicipalEtapaEntity>,
    @Inject(forwardRef(() => SecretariaMunicipalService))
    private readonly secretariaMunicipalService: SecretariaMunicipalService,
    private readonly etapaService: EtapaService,
  ) {}

  async create(
    data: CreateSecretariaMunicipalEtapaDto,
  ): Promise<SecretariaMunicipalEtapaEntity> {
    const secretariaMunicipalEtapa = this.repository.create();

    if (data.secretariaMunicipal) {
      secretariaMunicipalEtapa.secretariaMunicipal =
        await this.secretariaMunicipalService.findOne(
          null,
          data.secretariaMunicipal.id,
        );
    }

    if (data.etapa) {
      secretariaMunicipalEtapa.etapa = await this.etapaService.findOne(
        null,
        data.etapa.id,
      );
    }

    this.repository.merge(secretariaMunicipalEtapa, {
      id: uuidv4(),
      ...data,
    });



    return this.repository.save(secretariaMunicipalEtapa);
  }

  async update(
    id: string,
    data: UpdateSecretariaMunicipalEtapaDto,
  ): Promise<SecretariaMunicipalEtapaEntity> {

    const secretariaMunicipalEtapa = await this.repository.findOne({
      where: { id },
    });

    if (!secretariaMunicipalEtapa) {
      throw new Error('SecretariaMunicipalEtapa não encontrada');
    }

    if (data.secretariaMunicipal) {
      secretariaMunicipalEtapa.secretariaMunicipal =
        await this.secretariaMunicipalService.findOne(
          null,
          data.secretariaMunicipal.id,
        );
    }

    if (data.etapa) {
      secretariaMunicipalEtapa.etapa = await this.etapaService.findOne(
        null,
        data.etapa.id,
      );
    }

    secretariaMunicipalEtapa.idadeInicial =
      data.idadeInicial ?? secretariaMunicipalEtapa.idadeInicial;
    secretariaMunicipalEtapa.idadeFinal =
      data.idadeFinal ?? secretariaMunicipalEtapa.idadeFinal;
    secretariaMunicipalEtapa.ativa =
      data.ativa ?? secretariaMunicipalEtapa.ativa;

    secretariaMunicipalEtapa.apelido =
      data.apelido ?? secretariaMunicipalEtapa.apelido;

    return this.repository.save(secretariaMunicipalEtapa);
  }

  async findBySecretariaMunicipalIdAndAtiva(
    secretariaMunicipalId: string,
  ): Promise<SecretariaMunicipalEtapaEntity[]> {
    const secretariaMunicipalEtapas = await this.repository.find({
      where: {
        secretariaMunicipal: { id: secretariaMunicipalId },
        ativa: true,
      },
      relations: ['etapa', 'secretariaMunicipal'],
    });

    if (!secretariaMunicipalEtapas) {
      throw new NotFoundException(
        `Nenhuma SecretariaMunicipalEtapa encontrada vinculada a SecretariaMunicipal ${secretariaMunicipalId}!`,
      );
    }

    return secretariaMunicipalEtapas;
  }
}
