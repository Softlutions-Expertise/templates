import { IParametroUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { parametroDefaultValues } from './parametro-default-values';
import { parametroValidationShema } from './parametro-validation-shema';

// ----------------------------------------------------------------------

export const parametroResolver = (currentData?: IParametroUpdate) => {
  return useForm({
    resolver: yupResolver(parametroValidationShema) as any,
    defaultValues: parametroDefaultValues(currentData),
  });
};
