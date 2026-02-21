import { IHoliday } from '../../../interfaces/IHoliday';

export const checkNacional = (holiday: IHoliday) => {
  return holiday.description === 'Feriado Nacional';
};

export const checkEstadual = (holiday: IHoliday) => {
  return holiday.description === 'Feriado Estadual';
};
