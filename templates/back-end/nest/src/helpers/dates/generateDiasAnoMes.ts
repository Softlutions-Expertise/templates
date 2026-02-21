import { addDays, getDaysInMonth } from 'date-fns';
import { min_max } from '../min-max';

const parseAnoMes = (anoReferencia: number, mesReferencia: number) => {
  const anoAtual = new Date().getFullYear();

  const ano = min_max(anoAtual, anoAtual + 10, anoReferencia);
  const mes = min_max(1, 12, mesReferencia);

  return { ano, mes };
};

const getMonthFirstDate = (anoReferencia: number, mesReferencia: number) => {
  const { ano, mes } = parseAnoMes(anoReferencia, mesReferencia);

  const inicio = new Date(
    `${ano}-${mes.toString().padStart(2, '0')}-01T00:00:00.000Z`,
  );

  return inicio;
};

export const generateDiasAnoMes = function* (ano: number, mes: number) {
  const inicio = getMonthFirstDate(ano, mes);

  const quantidadeDias = getDaysInMonth(inicio);

  for (let offset = 0; offset < quantidadeDias; offset++) {
    yield addDays(inicio, offset);
  }
};
