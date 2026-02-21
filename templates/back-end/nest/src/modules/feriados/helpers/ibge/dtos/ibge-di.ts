import { IMunicipioDto, IUnidadeFederativaDto } from './ibge-dtos';

export interface ICacheIbge {
  getIbgeCity(idCityIbge: string | number): Promise<IMunicipioDto | null>;

  setIbgeCity(
    idCityIbge: string | number,
    city: IMunicipioDto,
  ): Promise<IMunicipioDto>;

  getIbgeState(
    idStateIbge: string | number,
  ): Promise<IUnidadeFederativaDto | null>;

  setIbgeState(
    idStateIbge: string | number,
    state: IUnidadeFederativaDto,
  ): Promise<IUnidadeFederativaDto>;
}
