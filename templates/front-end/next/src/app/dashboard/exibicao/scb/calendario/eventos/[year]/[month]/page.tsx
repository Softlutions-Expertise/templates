import { CalendarioNewEditView } from '@/screens/dashboard/exibicao/scb/calendario/views';

// ----------------------------------------------------------------------

interface PageProps {
  params: {
    year: string;
    month: string;
  };
}

export default function CalendarioEventosViewerPage({ params }: PageProps) {
  const { year, month } = params;
  return <CalendarioNewEditView year={year} month={month} />;
}
