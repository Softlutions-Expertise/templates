import { IPainelDigitalCreateEdit } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { painelDigitalDefaultValues } from './painel-digital-default-values';
import { painelDigitalValidationShema } from './painel-digital-validation-shema';

// ----------------------------------------------------------------------
export const PainelDigitalResolver = (currentForm?: IPainelDigitalCreateEdit) => {
  const defaultValues = painelDigitalDefaultValues(currentForm);
  return useForm({
    resolver: yupResolver(painelDigitalValidationShema),
    defaultValues,
  });
};
