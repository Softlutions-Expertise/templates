import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { useContainer } from 'class-validator';
import { Repository } from 'typeorm';

import { DatabaseModule } from '../database/database.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { baseProvider } from '../modules/providers/base.provider';
import { pessoaProvider } from '../modules/providers/pessoa.provider';

import { EnderecoEntity } from '../modules/base/entities/endereco.entity';
import {
  Motivo,
  Servico,
} from '../modules/base/entities/enums/log-coordenada.enum';
import { LogCoordenadaEntity } from '../modules/base/entities/log-coordenada.entity';
import { UsuarioEntity } from '../modules/pessoa/entities/usuario.entity';

const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_KEY ?? null;

@Module({
  imports: [DatabaseModule, InfrastructureModule],
  controllers: [],
  providers: [...baseProvider, ...pessoaProvider],
})
class CustomModule {}

interface GeocodeRepositories {
  endereco: Repository<EnderecoEntity>;
  logCoordenada: Repository<LogCoordenadaEntity>;
  usuario: Repository<UsuarioEntity>;
}

interface IUpdateToPerform {
  getRows(repositories: GeocodeRepositories): AsyncIterable<{ id: string }>;
  handle(
    entityId: string,
    repositories: GeocodeRepositories,
    username: string,
  ): Promise<void>;
}

async function buscarUsuarioAtivo(
  usuarioRepository: Repository<UsuarioEntity>,
  username: string,
): Promise<UsuarioEntity> {
  const usuario = await usuarioRepository.findOne({
    where: { usuario: username, situacaoCadastral: true },
  });

  if (!usuario) {
    throw new Error(`Usuário '${username}' não encontrado ou inativo`);
  }

  return usuario;
}

async function registrarLog(
  repositories: GeocodeRepositories,
  data: {
    endereco: string;
    servico: Servico;
    latitude: number;
    longitude: number;
    usuario: UsuarioEntity;
  },
): Promise<void> {
  try {
    await repositories.logCoordenada.save({
      endereco: data.endereco,
      servico: data.servico,
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
      motivo: Motivo.CorrecaoLatLong,
      usuario: data.usuario,
    });
    console.log('✅ Log registrado com sucesso');
  } catch (error) {
    console.warn('⚠️  Erro ao registrar log:', error.message);
  }
}

async function geocodeAddress(
  endereco: string,
  repositories: GeocodeRepositories,
  usuario: UsuarioEntity,
): Promise<{ latitude: number; longitude: number } | null> {
  let servico = Servico.GoogleMaps;
  let latitude: number | null = null;
  let longitude: number | null = null;
  const maxRetries = 3;

  if (GOOGLE_API_KEY) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          endereco,
        )}&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(url);

        if (response.data.status === 'OK' && response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          latitude = location.lat;
          longitude = location.lng;
          break;
        }
      } catch (error) {
        if (attempt === maxRetries) {
          console.warn(`Google Maps falhou após ${maxRetries} tentativas`);
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  if (!latitude || !longitude) {
    servico = Servico.OpenStreetMap;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          endereco,
        )}&format=json&limit=1`;
        const response = await axios.get(url, {
          headers: { 'User-Agent': 'Fila-Espera-API/1.0' },
        });

        if (response.data.length > 0) {
          latitude = parseFloat(response.data[0].lat);
          longitude = parseFloat(response.data[0].lon);
          break;
        }
      } catch (error) {
        if (attempt === maxRetries) {
          console.warn(`OpenStreetMap falhou após ${maxRetries} tentativas`);
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  if (latitude && longitude) {
    await registrarLog(repositories, {
      endereco,
      servico,
      latitude,
      longitude,
      usuario,
    });

    return { latitude, longitude };
  }

  return null;
}

function formatarEndereco(endereco: EnderecoEntity): string {
  return [
    endereco.logradouro,
    endereco.numero,
    endereco.bairro,
    endereco.cidade?.nome,
    endereco.cidade?.estado?.nome,
    endereco.cep,
  ]
    .filter(Boolean)
    .join(', ');
}

const enderecoOperation: IUpdateToPerform = {
  async *getRows(repositories) {
    const rows = await repositories.endereco
      .createQueryBuilder('endereco')
      .where('endereco.latitude IS NULL OR endereco.longitude IS NULL')
      .select(['endereco.id'])
      .getMany();

    yield* rows;
  },

  async handle(entityId, repositories, username) {
    const usuario = await buscarUsuarioAtivo(repositories.usuario, username);

    const entity = await repositories.endereco
      .createQueryBuilder('endereco')
      .leftJoinAndSelect('endereco.cidade', 'cidade')
      .leftJoinAndSelect('cidade.estado', 'estado')
      .where('endereco.id = :id', { id: entityId })
      .getOne();

    if (!entity) return;

    const enderecoCompleto = formatarEndereco(entity);
    console.log(`📍 Processando: ${enderecoCompleto}`);

    const coordenadas = await geocodeAddress(
      enderecoCompleto,
      repositories,
      usuario,
    );

    if (coordenadas) {
      await repositories.endereco.update(entityId, {
        latitude: coordenadas.latitude.toString(),
        longitude: coordenadas.longitude.toString(),
      });

      console.log(
        `✅ Coordenadas: ${coordenadas.latitude}, ${coordenadas.longitude}`,
      );
    } else {
      console.warn(`❌ Não foi possível geocodificar: ${enderecoCompleto}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  },
};

async function geocode(repositories: GeocodeRepositories, username: string) {
  let sucessos = 0;
  let erros = 0;
  let total = 0;

  console.log('🚀 Iniciando processamento...');

  for await (const row of enderecoOperation.getRows(repositories)) {
    total++;

    try {
      console.log(`\n[${total}] Geocodificando endereço ${row.id}`);

      await enderecoOperation.handle(row.id, repositories, username);

      sucessos++;

      if (total % 10 === 0) {
        console.log(`📊 Progresso: ${total} endereços processados`);
      }
    } catch (error) {
      erros++;
      console.error(`❌ Erro no endereço ${row.id}:`, error.message);
    }
  }

  console.log('\n🎯 Geocoding finalizado!');
  console.log(
    `📊 Resultado: ${sucessos} sucessos, ${erros} erros, ${total} total`,
  );
}

async function main() {
  const username = process.env.GEOCODE_USERNAME;

  if (!username) {
    console.error('❌ ERRO: Variável GEOCODE_USERNAME é obrigatória!');
    console.log(
      '\n💡 Use: GEOCODE_USERNAME=seu_username npm run geocode-enderecos',
    );
    process.exit(1);
  }

  const app = await NestFactory.create(CustomModule);
  useContainer(app.select(CustomModule), { fallbackOnErrors: true });

  const repositories: GeocodeRepositories = {
    endereco: app.get('ENDERECO_REPOSITORY'),
    logCoordenada: app.get('LOG_COORDENADA_REPOSITORY'),
    usuario: app.get('USUARIO_REPOSITORY'),
  };

  console.log(`🔐 Usuário: ${username}`);

  try {
    await buscarUsuarioAtivo(repositories.usuario, username);
    console.log('✅ Usuário validado com sucesso!');

    await geocode(repositories, username);
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
