import { EntrevistaEntity } from '../../entrevista/entities/entrevista.entity';

export const getDateTimeEntrevista = (
  entrevista: Pick<EntrevistaEntity, 'dataEntrevista' | 'horarioEntrevista'>,
) => {
  const data = new Date(entrevista.dataEntrevista);
  const hora = entrevista.horarioEntrevista;

  const dataHora = new Date(data);

  const horaSplit = hora.split(':');

  const horaInt = Number.parseInt(horaSplit[0], 10);
  const minutoInt = Number.parseInt(horaSplit[1], 10);

  dataHora.setHours(horaInt);
  dataHora.setMinutes(minutoInt);

  return dataHora;
};
