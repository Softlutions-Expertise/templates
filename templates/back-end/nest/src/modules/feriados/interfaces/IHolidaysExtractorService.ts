import { IHoliday } from './IHoliday';

export interface IHolidayExtractorService {
  getHolidays(
    year: string | number,
    idStateIbge?: string | number,
    idCityIbge?: string | number,
  ): Promise<IHoliday[]>;
}
