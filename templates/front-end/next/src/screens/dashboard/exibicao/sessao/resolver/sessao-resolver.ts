import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { ISessaoCreate, ISessaoEdit } from '@/models';

import { SessaoDefaultValues } from './sessao-default-values';
import { SessaoValidationShema, sessaoEditValidationShema } from './sessao-validation-shema';

// ----------------------------------------------------------------------

export const SessaoResolver = (currentData?: any) => {
  const isEdit = currentData && currentData.data && currentData.hora;
  
  if (isEdit) {
    return useForm<ISessaoEdit>({
      resolver: yupResolver(sessaoEditValidationShema) as any,
      defaultValues: SessaoDefaultValues(currentData) as any,
      mode: 'all',
    });
  }
  
  return useForm<ISessaoCreate>({
    resolver: yupResolver(SessaoValidationShema) as any,
    defaultValues: SessaoDefaultValues(currentData) as any,
    mode: 'all',
  });
};
