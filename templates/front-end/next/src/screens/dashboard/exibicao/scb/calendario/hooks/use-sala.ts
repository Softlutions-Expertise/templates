import merge from 'lodash/merge';
import { useMemo } from 'react';
import { CalendarEvent, CalendarRange, UseEventReturn } from '@/models';

// ----------------------------------------------------------------------

export default function useSala(
  events: CalendarEvent[] | undefined,
  selectEventId: string,
  selectedRange: CalendarRange | null,
  openForm: boolean
): UseEventReturn | undefined {
  const currentEvent = events?.find((event) => event.id === selectEventId);

  const defaultValues = useMemo(
    (): UseEventReturn => ({
      id: '',
      title: '',
      description: '',
      color: '',
      allDay: false,
      start: selectedRange ? selectedRange.start : new Date().getTime(),
      end: selectedRange ? selectedRange.end - 86400000 : new Date().getTime(),
    }),
    [selectedRange],
  );

  if (!openForm) {
    return undefined;
  }

  if (currentEvent || selectedRange) {
    return merge({}, defaultValues, currentEvent);
  }

  return defaultValues;
}
