'use client';

import { CalendarEvent, CalendarRange } from '@/models';
import { fTimestamp } from '@/utils';
import { useResponsive } from '@softlutions/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

interface UseCalendarProps {
  updateEvent?: (eventData: Partial<CalendarEvent>) => void;
  initialYear?: string;
  initialMonth?: string;
}

interface UseCalendarReturn {
  calendarRef: React.RefObject<any>;
  view: string;
  date: Date | undefined;
  year: string | undefined;
  month: number | undefined;
  onDatePrev: () => void;
  onDateNext: () => void;
  onDropEvent: (arg: any, updateEvent: (eventData: Partial<CalendarEvent>) => void) => void;
  onClickEvent: (arg: any) => void;
  onChangeView: (newView: string) => void;
  onSelectRange: (arg: any) => void;
  onResizeEvent: (arg: any, updateEvent: (eventData: Partial<CalendarEvent>) => void) => void;
  onInitialView: () => void;
  openForm: boolean;
  onOpenForm: () => void;
  onCloseForm: () => void;
  selectEventId: string;
  selectedRange: CalendarRange | null;
  setDate: (date: Date | undefined) => void;
  setYear: (year: string | undefined) => void;
  setMonth: (month: number | undefined) => void;
  onClickEventInFilters: (eventId: string) => void;
}

export default function useCalendar(props?: UseCalendarProps): UseCalendarReturn {
  const router = useRouter();
  const pathname = usePathname();
  const smUp = useResponsive('up', 'sm');

  const { initialYear, initialMonth } = props || {};

  const [date, setDate] = useState<Date | undefined>();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectEventId, setSelectEventId] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<CalendarRange | null>(null);
  const [year, setYear] = useState<string | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const [view, setView] = useState<string>(smUp ? 'dayGridMonth' : 'listWeek');

  const calendarRef = useRef<any>(null);
  const calendarEl = calendarRef.current;

  const onOpenForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const onCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedRange(null);
    setSelectEventId('');
  }, []);

  const onInitialView = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = smUp ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarEl, smUp]);

  const onChangeView = useCallback(
    (newView: string) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarEl],
  );

  const onDatePrev = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());

      setYear(new Date(calendarApi.getDate()).getFullYear().toString());
      setMonth(new Date(calendarApi.getDate()).getMonth() + 1);
    }
  }, [calendarEl]);

  const onDateNext = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());

      setYear(new Date(calendarApi.getDate()).getFullYear().toString());
      setMonth(new Date(calendarApi.getDate()).getMonth() + 1);
    }
  }, [calendarEl]);

  const onSelectRange = useCallback(
    (arg: any) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.unselect();
      }
      onOpenForm();
      setSelectedRange({
        start: fTimestamp(arg.start) as number,
        end: fTimestamp(arg.end) as number,
      });
    },
    [calendarEl, onOpenForm],
  );

  const onClickEvent = useCallback(
    (arg: any) => {
      const { event } = arg;
      onOpenForm();
      setSelectEventId(event.id);
    },
    [onOpenForm],
  );

  const onResizeEvent = useCallback((arg: any, updateEvent: (eventData: Partial<CalendarEvent>) => void) => {
    const { event } = arg;

    updateEvent({
      id: event.id,
      allDay: event.allDay,
      start: fTimestamp(event.start) as number,
      end: fTimestamp(event.end) as number,
    });
  }, []);

  const onDropEvent = useCallback((arg: any, updateEvent: (eventData: Partial<CalendarEvent>) => void) => {
    const { event } = arg;

    updateEvent({
      id: event.id,
      allDay: event.allDay,
      start: fTimestamp(event.start) as number,
      end: fTimestamp(event.end) as number,
    });
  }, []);

  const onClickEventInFilters = useCallback(
    (eventId: string) => {
      if (eventId) {
        onOpenForm();
        setSelectEventId(eventId);
      }
    },
    [onOpenForm],
  );

  useEffect(() => {
    if (year && month) {
      const formattedMonth = month > 9 ? month : `0${month}`;

      const basePath = '/dashboard/exibicao/scb/calendario/eventos';
      const newPath = `${basePath}/${year}/${month}`;
      const currentData = `year=${year}&month=${formattedMonth}`;
      const fullPath = `${newPath}?${currentData}`;

      const currentPath = `${pathname}${window.location.search}`;
      if (currentPath !== `${newPath}${window.location.search}` &&
        currentPath !== fullPath) {
        router.replace(fullPath);
      }
    }
  }, [year, month, pathname, router]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    let yearValue: string;
    let monthValue: string;

    if (params.year || params.month) {
      yearValue = params.year || new Date().getFullYear().toString();
      monthValue = params.month || (new Date().getMonth() + 1).toString();
    } else if (initialYear || initialMonth) {
      yearValue = initialYear || new Date().getFullYear().toString();
      monthValue = initialMonth || (new Date().getMonth() + 1).toString();
    } else {
      yearValue = new Date().getFullYear().toString();
      monthValue = (new Date().getMonth() + 1).toString();
    }

    const currentMonth = parseInt(monthValue) > 9 ? parseInt(monthValue) : `0${parseInt(monthValue)}`;
    setDate(new Date(`${yearValue}-${currentMonth}-01T00:00:00`));
    setYear(yearValue);
    setMonth(parseInt(monthValue));
  }, [initialYear, initialMonth]);

  return {
    calendarRef,
    view,
    date,
    year,
    month,
    onDatePrev,
    onDateNext,
    onDropEvent,
    onClickEvent,
    onChangeView,
    onSelectRange,
    onResizeEvent,
    onInitialView,
    openForm,
    onOpenForm,
    onCloseForm,
    selectEventId,
    selectedRange,
    setDate,
    setYear,
    setMonth,
    onClickEventInFilters,
  };
}
