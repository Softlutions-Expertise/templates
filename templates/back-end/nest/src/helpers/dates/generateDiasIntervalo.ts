import { addDays, differenceInDays } from 'date-fns';

export const generateDiasIntervalo = function* (
  inicio: Date | number | string,
  fim: Date | number | string,
) {
  const dateInicio = new Date(inicio);
  const dateFim = new Date(fim);

  const diferenca = differenceInDays(dateFim, dateInicio);

  if (diferenca <= 0) {
    return;
  }

  for (let offset = 0; offset < diferenca; offset++) {
    const dia = addDays(dateInicio, offset);
    yield dia;
  }
};
