import { IInutilizacaoCreateUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { inutilizacaoDefaultValues } from './inutilizacao-default-values';
import { inutilizacaoValidationShema } from './inutilizacao-validation-shema';

// ----------------------------------------------------------------------

export const inutilizacaoResolver = (currentData?: IInutilizacaoCreateUpdate) => {

  return useForm({
    resolver: yupResolver(inutilizacaoValidationShema),
    defaultValues: inutilizacaoDefaultValues(currentData),
  });
};
