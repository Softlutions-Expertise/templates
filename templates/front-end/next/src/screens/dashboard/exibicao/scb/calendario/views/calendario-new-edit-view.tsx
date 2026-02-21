'use client';

import { Container } from '@/components';

import CalendarEvents from '../components/calendar-salas';

// ----------------------------------------------------------------------

interface CalendarioNewEditViewProps {
  year?: string;
  month?: string;
}

export function CalendarioNewEditView({ year, month }: CalendarioNewEditViewProps) {
  return (
    <Container>
      <CalendarEvents year={year} month={month} />
    </Container>
  );
}
