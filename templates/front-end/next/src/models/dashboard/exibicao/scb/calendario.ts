// DTOs for calendario-academico module

// Event color/type interface
export interface CalendarEventColor {
  id: number;
  cor: string;
  nome: string;
}

// Calendar event from API
export interface CalendarEventAPI {
  id: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  letivo: boolean;
  status: {
    cod: number;
    descricao: string;
  };
  tipo: {
    cor: string;
  };
}

// Formatted calendar event for display
export interface CalendarEventFormatted {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string; // Mantém para compatibilidade
  backgroundColor?: string; // Cor de fundo para FullCalendar
  borderColor?: string; // Cor da borda para FullCalendar
  textColor: string;
  description: string;
  letivo: boolean;
  status?: {
    cod: number;
    descricao: string;
  };
  valido?: boolean; // Mantém para compatibilidade, mas será calculado baseado em status.cod === 4
  differentStartEnd: boolean;
  realStart?: Date;
  realEnd?: Date;
  allDay?: boolean;
}

// Sala status interface
export interface SalaStatus {
  cod: number;
  descricao: string;
  // Propriedades adicionais para funcionalidades de salas
  disponivel?: boolean;
  ocupacao?: string;
  eventos?: number;
  retificada?: boolean;
  enviada?: boolean;
  statusCod?: number;
}

// Sala interface
export interface Sala {
  id: number;
  nome: string;
  status: SalaStatus;
}

// Calendar sala data interface
// Calendar sala data for a specific date
export interface CalendarSalaData {
  data: string; // formato: 'YYYY-MM-DD'
  salas: Sala[];
}

// Monthly calendar data (array of dates with salas)
export interface CalendarMonthlyData extends Array<CalendarSalaData> {}

// Event type interface (legacy)
export interface EventType {
  id: number;
  nome: string;
  cor: string;
}

// Calendar event interface (legacy)
export interface CalendarEventLegacy {
  id: string;
  dataInicio: string;
  dataFim: string;
  letivo: boolean;
  valido?: boolean;
  descricao: string;
  createdAt: string;
  updatedAt: string | null;
  tipo: EventType;
  importado: boolean;
}

// Month events interface
export interface MonthEvents {
  mes: number;
  eventos: CalendarEventLegacy[];
}

// Calendar data interface
export interface CalendarData {
  id: string;
  nome: string;
  ano: string;
  eventosPorMes: MonthEvents[];
  calendarioBase: {
    id: string;
    nome: string;
    ano: string;
  };
}

// Calendar event data interface
export interface CalendarEventData {
  id?: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  color: string;
  letivo?: boolean;
  description: string;
  differentStartEnd?: boolean;
  realStart?: Date;
  realEnd?: Date;
}

// Calendar form data interface
export interface CalendarFormData {
  allDay: boolean;
  start: Date;
  end: Date;
  color: string;
  letivo: boolean;
  description: string;
}

// Calendar form props interface
export interface CalendarFormProps {
  currentEvent?: CalendarEventData;
  colors: CalendarEventColor[];
  onClose: () => void;
  onSubmit?: (data: CalendarFormData) => void;
  onDelete?: (id: string) => void;
}

// Calendar events props interface
export interface CalendarEventsProps {
  year?: string;
  month?: string;
}

// Marked day interface
export interface MarkedDay {
  month: number;
  day: number;
  year: number;
  color: string;
  description?: string;
  data?: any; // Dados originais da API
}

// Calendar event interface
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  start: number;
  end: number;
}

// Calendar range interface
export interface CalendarRange {
  start: number;
  end: number;
}

// Calendar config interface
export interface CalendarConfig {
  days: {
    short: Record<number, string>;
    long: Record<number, string>;
    getOrderedDays: (startDay?: number, format?: 'short' | 'long') => string[];
  };
  months: string[];
  views: {
    month: {
      getOrderedDays: (format?: 'short' | 'long') => string[];
    };
    year: {
      getOrderedDays: (format?: 'short' | 'long') => string[];
    };
  };
}

// Calendar events year props interface
export interface CalendarEventsYearProps {
  month: number;
  year: number;
  daysOfOtherMonths?: boolean;
  onClick?: () => void;
  forceShowEvents?: boolean;
}

// Calendar events list props interface
export interface CalendarEventsListProps {
  year: string;
  month: string;
}

// Hook interfaces
export interface UseCalendarReturn {
  date: Date | undefined;
  openForm: boolean;
  selectEventId: string;
  selectedRange: CalendarRange | null;
  year: number | undefined;
  month: number | undefined;
  view: string;
  calendarRef: React.RefObject<any>;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onInitialView: () => void;
  onChangeView: (newView: string) => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onSelectRange: (range: CalendarRange) => void;
  onClickEvent: (eventId: string) => void;
  onResizeEvent: (eventId: string, start: number, end: number) => void;
  onDropEvent: (eventId: string, start: number, end: number) => void;
  onClickDateEvent: (date: Date) => void;
  onDateToday: () => void;
  onSelectEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (eventId: string, eventData: Partial<CalendarEvent>) => void;
  onCreateEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onClickDateInMonth: (date: Date) => void;
}

export interface UseEventReturn {
  id: string;
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  start: number;
  end: number;
}

// API Response types
export type CalendarSalasResponse = CalendarSalaData[];
export type CalendarEventsResponse = CalendarData;

// Calendar filter interface
export interface CalendarFilter {
  colors: string[];
  startDate: Date | null;
  endDate: Date | null;
}

// Calendar toolbar props interface
export interface CalendarToolbarProps {
  date: Date;
  view: string;
  loading?: boolean;
  onNextDate: VoidFunction;
  onPrevDate: VoidFunction;
  onToday: VoidFunction;
  onChangeView: (view: string) => void;
  onOpenFilters?: VoidFunction;
}

// Calendar view props interface
export interface CalendarViewProps {
  events: CalendarEventFormatted[];
  loading: boolean;
  onDateNext: VoidFunction;
  onDatePrev: VoidFunction;
  onDateToday: VoidFunction;
  onChangeView: (view: string) => void;
  onClickEvent: (event: any) => void;
  onSelectRange: (range: any) => void;
  onOpenForm: VoidFunction;
  onCloseForm: VoidFunction;
  openForm: boolean;
  currentEvent?: CalendarEventData;
  colors: CalendarEventColor[];
  onFormSubmit: (data: CalendarFormData) => void;
  onEventDelete: (id: string) => void;
}

// Calendar Yearly Data - Para visualização anual
export interface CalendarYearlyData {
  data: string;
  totalValidado: number;
  totalOutros: number;
}
