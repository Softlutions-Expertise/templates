import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { GetDoc, PostDoc } from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { NeedsAuth } from '../../../infrastructure';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { LogCoordenadaDto } from '../dto/log-coordenada.dto';
import { EnderecoService } from '../services/endereco.service';

@ApiTags('Base')
@Controller('base/endereco')
export class EnderecoController {
  constructor(private readonly enderecoservice: EnderecoService) {}

  @NeedsAuth()
  @Get('/cep/:cep')
  @GetDoc('Base', 'admin')
  getEnderecoByCep(@Param('cep') cep: string) {
    return this.enderecoservice.getEnderecoByCep(cep);
  }

  @NeedsAuth()
  @Get('/cidade/:cidade')
  @GetDoc('Base', 'admin')
  async obtenerLatitudLongitud(@Param('cidade') cidade: string) {
    const encodedCity = encodeURIComponent(cidade);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedCity}&format=json&limit=1`;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.get(url);
        const results = response.data;

        if (results.length > 0) {
          const { lat, lon } = results[0];
          return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
          console.log(`Não foi possível encontrar a cidade: ${cidade}`);
          return { latitude: null, longitude: null };
        }
      } catch (error) {
        console.error(
          `Erro ao obter coordenadas (tentativa ${attempt}/${maxRetries}):`,
          error.message,
        );

        if (attempt === maxRetries) {
          console.error(
            `Falha após ${maxRetries} tentativas para a cidade: ${cidade}`,
          );
          return { latitude: null, longitude: null };
        }

        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  @NeedsAuth()
  @Post('/coordenadas')
  @PostDoc(
    'Base',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    LogCoordenadaDto,
  )
  async getLatLongByEndereco(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() dto: LogCoordenadaDto,
  ) {
    return this.enderecoservice.getLatLongByEndereco(acessoControl, dto);
  }
}
