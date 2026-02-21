import { INotaFiscalCreateUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { notaFiscalDefaultValues } from './nota-fiscal-default-values';
import { notaFiscalValidationShema } from './nota-fiscal-validation-shema';

// ----------------------------------------------------------------------

export const notaFiscalResolver = (currentForm?: INotaFiscalCreateUpdate) => {
  return useForm({
    resolver: yupResolver(notaFiscalValidationShema),
    defaultValues: notaFiscalDefaultValues(currentForm),
  });
};
