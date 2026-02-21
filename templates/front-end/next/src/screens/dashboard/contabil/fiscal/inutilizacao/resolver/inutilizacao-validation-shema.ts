import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesValidationShema = yup.object().shape({
  modelo: yup.number().required('O modelo é obrigatório'),
  serie: yup.number().required('A série é obrigatória'),
  sequencias: yup
    .array()
    .of(
      yup.object().shape({
        numeracaoInicial: yup.number().required('Numeração inicial é obrigatória'),
        numeracaoFinal: yup
          .number()
          .nullable()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
          .when('numeracaoInicial', (numeracaoInicial: any, schema: any) =>
            schema.test({
              test: (numeracaoFinal: number | null) =>
                numeracaoFinal === null || numeracaoFinal >= numeracaoInicial[0],
              message: 'Numeração final deve ser maior ou igual à inicial',
            })
          ),
      })
    )
    .min(1, 'Adicione pelo menos uma sequência')
    .required('As sequências são obrigatórias'),
  justificativa: yup
    .string()
    .required('A justificativa é obrigatória')
    .min(15, 'A justificativa deve ter no mínimo 15 caracteres'),
});

export const inutilizacaoValidationShema = yup.object().shape({
  ...informacoesValidationShema.fields,
});
