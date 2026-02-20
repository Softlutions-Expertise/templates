import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { CreateEnderecoDto } from '../dto/create-endereco.dto';
import { LogCoordenadaDto } from '../dto/log-coordenada.dto';
import { EnderecoEntity } from '../entities/endereco.entity';
import { Servico } from '../entities/enums/log-coordenada.enum';
import { LogCoordenadaEntity } from '../entities/log-coordenada.entity';
import { DistritoService } from './distrito.service';
import { SubdistritoService } from './subdistrito.service';

const GOOGLE_API_KEY = process.env.GOOGLE_KEY ?? null;

@Injectable()
export class EnderecoService {
  constructor(
    @Inject('ENDERECO_REPOSITORY')
    private repository: Repository<EnderecoEntity>,
    @Inject('LOG_COORDENADA_REPOSITORY')
    private logCoordenadaRepository: Repository<LogCoordenadaEntity>,
    private distritoService: DistritoService,
    private subdistritoService: SubdistritoService,
  ) {}

  static EnderecoQueryView(qb: SelectQueryBuilder<any>, alias = 'endereco') {
    qb.leftJoin(`${alias}.cidade`, `${alias}_cidade`);
    qb.leftJoin(`${alias}_cidade.estado`, `${alias}_cidade_estado`);
    qb.leftJoin(`${alias}.distrito`, `${alias}_distrito`);
    qb.leftJoin(`${alias}.subdistrito`, `${alias}_subdistrito`);
    qb.addSelect([
      `${alias}`,
      `${alias}_cidade`,
      `${alias}_cidade_estado`,
      `${alias}_distrito`,
      `${alias}_subdistrito`,
    ]);
  }

  async findOne(id: string): Promise<EnderecoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['distrito', 'subdistrito'],
    });

    if (!entity) {
      throw new NotFoundException(`Endereço não encontrado`);
    }

    return entity;
  }

  async create(data: CreateEnderecoDto): Promise<EnderecoEntity> {
    const endereco = this.repository.create({
      ...data,
      id: uuidv4(),
    });
    return await this.repository.save(endereco);
  }

  async createOrUpdate(data: any, id?: string): Promise<EnderecoEntity> | null {
    if (data === null) return null;

    if (data.distrito) {
      await this.distritoService.createOrUpdate(data.distrito);
    }
    if (data.subdistrito) {
      await this.subdistritoService.createOrUpdate(data.subdistrito);
    }

    if (id !== undefined) {
      data = await this.repository.preload({
        id: id,
        ...data,
      });
    } else data.id = uuidv4();

    return this.repository.save(data);
  }

  async getEnderecoByCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const info = response.data;

      const distritos = await axios.get(
        `http://servicodados.ibge.gov.br/api/v1/localidades/municipios/${info.ibge}/distritos`,
      );
      const distritosData = distritos.data.map((distrito) => {
        return {
          id: distrito.id,
          nome: distrito.nome,
          subdistritos: [],
        };
      });

      const subdistritos = await axios.get(
        `http://servicodados.ibge.gov.br/api/v1/localidades/municipios/${info.ibge}/subdistritos`,
      );
      const subdistritosData = subdistritos.data.map((subdistrito) => {
        return {
          id: subdistrito.id,
          nome: subdistrito.nome,
          id_distrito: subdistrito.distrito.id,
        };
      });

      subdistritosData.forEach((subdistrito) => {
        const distrito = distritosData.find(
          (distrito) => distrito.id === subdistrito.id_distrito,
        );
        if (distrito) {
          distrito.subdistritos.push(subdistrito);
        }
      });

      return { info, distritos: distritosData };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getLatLongByEndereco(
    acessoControl: AcessoControl,
    dto: LogCoordenadaDto,
  ): Promise<{ latitude: number | null; longitude: number | null }> {
    let servico = Servico.GoogleMaps;
    let latitude = null;
    let longitude = null;
    const maxRetries = 3;

    if (GOOGLE_API_KEY) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const encodedCity = encodeURIComponent(dto.endereco);
          const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedCity}&key=${GOOGLE_API_KEY}`;

          const response = await axios.get(url);
          const data = response.data;

          if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;

            latitude = location.lat;
            longitude = location.lng;
            break;
          } else {
            console.warn(
              `Google API não retornou um resultado válido para o endereço: ${dto.endereco}. Status: ${data.status}`,
            );
            break;
          }
        } catch (error) {
          console.error(
            `Erro na chamada da Google Maps API (tentativa ${attempt}/${maxRetries}):`,
            error.message,
          );

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
          }
        }
      }
    }

    if (!latitude && !longitude) {
      servico = Servico.OpenStreetMap;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const encodedCity = encodeURIComponent(dto.endereco);
          const url = `https://nominatim.openstreetmap.org/search?q=${encodedCity}&format=json&limit=1`;

          const response = await axios.get(url);
          const results = response.data;

          if (results.length > 0) {
            const { lat, lon } = results[0];

            latitude = parseFloat(lat);
            longitude = parseFloat(lon);
            break;
          } else {
            console.error(
              `Não foi possível encontrar coordenadas para o endereço: ${dto.endereco}`,
            );
            return { latitude: null, longitude: null };
          }
        } catch (error) {
          console.error(
            `Erro ao obter coordenadas do OpenStreetMap (tentativa ${attempt}/${maxRetries}):`,
            error.message,
          );

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
          } else {
            console.error(
              `Falha após ${maxRetries} tentativas para obter coordenadas do endereço: ${dto.endereco}`,
            );
            return { latitude: null, longitude: null };
          }
        }
      }
    }

    await this.logCoordenadaRepository.save({
      ...dto,
      servico,
      latitude,
      longitude,
      usuario: acessoControl.currentFuncionario.usuario,
    });

    return {
      latitude,
      longitude,
    };
  }
}
