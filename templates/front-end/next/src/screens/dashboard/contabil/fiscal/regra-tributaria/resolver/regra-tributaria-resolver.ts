import { IRegraTributariaCreateUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';


import { regraTributariaValidationShema } from './regra-tributaria-validation-shema';
import { regraTributariaDefaultValues } from './regra-tributaria-default-values';

// ----------------------------------------------------------------------

export const RegraTributariaResolver = (currentForm?: IRegraTributariaCreateUpdate) => {
  return useForm({
    resolver: yupResolver(regraTributariaValidationShema),
    defaultValues: regraTributariaDefaultValues(currentForm),
  });
};
