import Keyv from 'keyv';
import { ICacheIbge } from '../ibge/dtos/ibge-di';
import { IMunicipioDto, IUnidadeFederativaDto } from '../ibge/dtos/ibge-dtos';

export class CacheServiceIbge implements ICacheIbge {
  #cache = new Keyv({
    store: new Map(),
  });

  private getIbgeCityKey = (idCityIbge: string | number) => {
    return `city-${idCityIbge}`;
  };

  async getIbgeCity(
    idCityIbge: string | number,
  ): Promise<IMunicipioDto | null> {
    const key = this.getIbgeCityKey(idCityIbge);

    const hasCache = await this.#cache.has(key);

    if (hasCache) {
      return this.#cache.get(key);
    }

    return null;
  }

  async setIbgeCity(
    idCityIbge: string | number,
    city: IMunicipioDto,
  ): Promise<IMunicipioDto> {
    const key = this.getIbgeCityKey(idCityIbge);
    await this.#cache.set(key, city);
    return city;
  }

  private getIbgeStateKey = (idStateIbge: string | number) => {
    return `state-${idStateIbge}`;
  };

  async getIbgeState(
    idStateIbge: string | number,
  ): Promise<IUnidadeFederativaDto | null> {
    const key = this.getIbgeStateKey(idStateIbge);

    const hasCache = await this.#cache.has(key);

    if (hasCache) {
      return this.#cache.get(key);
    }

    return null;
  }

  async setIbgeState(
    idStateIbge: string | number,
    state: IUnidadeFederativaDto,
  ): Promise<IUnidadeFederativaDto> {
    const key = this.getIbgeStateKey(idStateIbge);
    await this.#cache.set(key, state);
    return state;
  }
}
