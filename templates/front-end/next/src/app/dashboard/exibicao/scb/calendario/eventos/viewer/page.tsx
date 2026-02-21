import { CalendarioNewEditView } from '@/screens/dashboard/exibicao/scb/calendario/views';

// ----------------------------------------------------------------------

interface PageProps {
  searchParams: {
    year?: string;
    month?: string;
  };
}

export default function CalendarioEventosViewerPage({ searchParams }: PageProps) {
  const { year, month } = searchParams;
  return <CalendarioNewEditView year={year} month={month} />;
}
