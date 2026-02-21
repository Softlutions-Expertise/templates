import { IMercadoriaUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { mercadoriaDefaultValues } from './mercadoria-default-values';
import { mercadoriaValidationShema } from './mercadoria-validation-shema';

// ----------------------------------------------------------------------

export const mercadoriaResolver = (currentData?: IMercadoriaUpdate) => {
  return useForm({
    resolver: yupResolver(mercadoriaValidationShema),
    defaultValues: mercadoriaDefaultValues(currentData),
  });
};
