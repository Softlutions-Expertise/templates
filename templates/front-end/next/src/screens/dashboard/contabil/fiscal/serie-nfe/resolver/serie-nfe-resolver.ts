import { ISerieNfeCreateUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { serieNfeDefaultValues } from './serie-nfe-default-values';
import { serieNfeValidationShema } from './serie-nfe-validation-shema';

// ----------------------------------------------------------------------

export const SerieNfeResolver = (currentForm?: ISerieNfeCreateUpdate) => {
  return useForm({
    resolver: yupResolver(serieNfeValidationShema),
    defaultValues: serieNfeDefaultValues(currentForm),
  });
};
