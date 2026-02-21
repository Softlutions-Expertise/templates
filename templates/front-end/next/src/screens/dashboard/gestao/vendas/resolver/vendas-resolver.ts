import { useForm } from 'react-hook-form';
import { IVendasViewer } from '@/models';

import { vendasDefaultValues } from './vendas-default-values';

// ----------------------------------------------------------------------
export const vendasResolver = (currentData?: IVendasViewer) => {
  const defaultValues = vendasDefaultValues(currentData);
  return useForm({
    defaultValues,
  });
};
