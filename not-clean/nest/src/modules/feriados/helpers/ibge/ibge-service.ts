import { ICacheIbge } from './dtos/ibge-di';
import { IMunicipioDto, IUnidadeFederativaDto } from './dtos/ibge-dtos';

export class IbgeService {
  constructor(private ibgeCacheService: ICacheIbge) {}

  async getCityInfo(idCityIbge: string | number) {
    const cachedCity = await this.ibgeCacheService.getIbgeCity(idCityIbge);

    if (cachedCity) {
      return cachedCity;
    }

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${idCityIbge}`,
    );

    const json: IMunicipioDto = await response.json();

    await this.ibgeCacheService.setIbgeCity(idCityIbge, json);

    return json;
  }

  async getUfByCityId(idCityIbge: string | number) {
    const city = await this.getCityInfo(idCityIbge);
    return city.microrregiao.mesorregiao.UF;
  }

  async getStateInfo(idStateIbge: string | number) {
    const cachedState = await this.ibgeCacheService.getIbgeState(idStateIbge);

    if (cachedState) {
      return cachedState;
    }

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idStateIbge
        .toString()
        .toLocaleLowerCase()}`,
    );

    const json: IUnidadeFederativaDto = await response.json();

    await this.ibgeCacheService.setIbgeState(idStateIbge, json);

    return json;
  }
}
