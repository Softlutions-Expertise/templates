import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { ISala } from '@/models';

import { salaDefaultValues } from './sala-default-values';
import { salaValidationShema } from './sala-validation-shema';

// ----------------------------------------------------------------------

export const salaResolver = (currentData?: ISala) => {
  return useForm<ISala>({
    resolver: yupResolver(salaValidationShema) as any,
    defaultValues: salaDefaultValues(currentData),
    mode: 'all',
  });
};
