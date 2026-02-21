const SIZE_POLTRONA = (lgUp: boolean, isVertical: boolean) =>
  lgUp ? '2vw' : isVertical ? '3.375vw' : '2.75vw';

const FONT_SIZE_POLTRONA = (lgUp: boolean, isVertical: boolean) =>
  lgUp ? '0.75vw' : isVertical ? '1.5vw' : '1vw';

const GAP_POLTRONA = '0.2vw';

const COLOR_POLTRONA = {
  DESOCUPADA: 'green',
  OCUPADA: '#212b36',
  SELECIONADA_INTEIRA: '#0059a9',
  SELECIONADA_MEIA: '#e97812',
  DEFAULT: '#ddd',
};

export const MAPA_POLTRONA_ENUM = {
  COLOR_POLTRONA,
  FONT_SIZE_POLTRONA,
  GAP_POLTRONA,
  SIZE_POLTRONA,
};
