import { CalendarConfig } from '@/models';

const DAYSOFWEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;

const MOTHES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

const CALENDAR_CONFIG: CalendarConfig = {
  days: {
    short: {
      0: 'Dom',
      1: 'Seg',
      2: 'Ter',
      3: 'Qua',
      4: 'Qui',
      5: 'Sex',
      6: 'Sáb'
    },
    long: {
      0: 'Domingo',
      1: 'Segunda',
      2: 'Terça',
      3: 'Quarta',
      4: 'Quinta',
      5: 'Sexta',
      6: 'Sábado'
    },
    getOrderedDays: (startDay = 0, format: 'short' | 'long' = 'short') => {
      const daysArray: string[] = [];
      for (let i = 0; i < 7; i++) {
        const dayIndex = (i + startDay) % 7;
        daysArray.push(CALENDAR_CONFIG.days[format][dayIndex]);
      }
      return daysArray;
    }
  },
  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  views: {
    month: {
      getOrderedDays: (format: 'short' | 'long' = 'short') => {
        const order = [1, 2, 3, 4, 5, 6, 0];
        return order.map(index => CALENDAR_CONFIG.days[format][index]);
      }
    },
    year: {
      getOrderedDays: (format: 'short' | 'long' = 'short') => {
        return CALENDAR_CONFIG.days.getOrderedDays(0, format);
      }
    }
  }
};

export { CALENDAR_CONFIG, DAYSOFWEEK, MOTHES };

