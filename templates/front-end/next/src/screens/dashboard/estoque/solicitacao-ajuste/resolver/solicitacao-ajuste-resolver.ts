import { ISolicitacaoAjusteCreateUpdate } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { solicitacaoAjusteDefaultValues } from './solicitacao-ajuste-default-values';
import { solicitacaoAjusteValidationShema } from './solicitacao-ajuste-validation-shema';

// ----------------------------------------------------------------------

export const solicitacaoAjusteResolver = (currentForm?: ISolicitacaoAjusteCreateUpdate) => {
  return useForm({
    resolver: yupResolver(solicitacaoAjusteValidationShema),
    defaultValues: solicitacaoAjusteDefaultValues(currentForm),
  });
};
