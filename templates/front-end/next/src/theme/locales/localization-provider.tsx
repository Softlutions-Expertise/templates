'use client';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ptBR from 'date-fns/locale/pt-BR';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export default function LocalizationProvider({ children }: Props) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      {children}
    </MuiLocalizationProvider>
  );
}
