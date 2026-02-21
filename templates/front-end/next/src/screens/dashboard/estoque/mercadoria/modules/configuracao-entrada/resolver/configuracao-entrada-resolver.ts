import { IConfiguracaoEntradaCreateUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { fornecedorDefaultValues } from './configuracao-entrada-default-values';
import { fornecedorValidationShema } from './configuracao-entrada-validation-shema';

// ----------------------------------------------------------------------

export const ConfiguracaoEntradaResolver = (currentData?: IConfiguracaoEntradaCreateUpdate) => {
  return useForm({
    resolver: yupResolver(fornecedorValidationShema),
    defaultValues: fornecedorDefaultValues(currentData),
  });
};
