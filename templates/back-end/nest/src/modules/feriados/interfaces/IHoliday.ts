export type IHoliday = {
  /**
   * Formato yyyy-mm-dd
   */
  date: string;

  /**
   * Nome do feriado.
   */
  name: string;

  /**
   * Descrição do feriado.
   */
  description: string | null;
};
