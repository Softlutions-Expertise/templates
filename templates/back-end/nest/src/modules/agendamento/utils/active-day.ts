import { GerenciaAgendamentoEntity } from '../entities/gerencia-agendamento.entity';

export const checkActiveDay = (
  gerencia: GerenciaAgendamentoEntity,
  date: Date,
) => {
  const dateObject = new Date(date);

  return [
    gerencia.disponibilidadeDomingo,
    gerencia.disponibilidadeSegunda,
    gerencia.disponibilidadeTerca,
    gerencia.disponibilidadeQuarta,
    gerencia.disponibilidadeQuinta,
    gerencia.disponibilidadeSexta,
    gerencia.disponibilidadeSabado,
  ][dateObject.getUTCDay()];
};
