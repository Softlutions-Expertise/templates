import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const informacoesValidationShema = yup.object().shape({
  id: yup.number().optional(),
  descricao: yup.string().required('A descrição é obrigatória'),
  codigoBeneficioFiscal: yup.string().optional(),
  cfopSaida: yup.string().required('O CFOP de saída'),
  icmsCstCsosn: yup.string().required('O ICMS CST/CSOSN'),
  pisCst: yup.string().required('O PIS CST'),
  cofinsCst: yup.string().required('O COFINS CST'),
  ibsCbsCst: yup.string().optional(),
  porcentagemReducaoBaseCalculoIcms: yup.number().required('Porcentagem de redução BC ICMS'),
  porcentagemReducaoBaseCalculoPis: yup.number().required('Porcentagem de redução BC PIS'),
  porcentagemReducaoBaseCalculoCofins: yup.number().required('Porcentagem de redução BC COFINS'),
  porcentagemReducaoBaseCalculoIbsCbs: yup.number().required('Porcentagem de redução BC IBS/CBS'),
  aliquotaIcms: yup.number().required('A alíquota ICMS é obrigatória'),
  aliquotaPis: yup.number().required('A alíquota PIS é obrigatória'),
  aliquotaCofins: yup.number().required('A alíquota COFINS é obrigatória'),
  aliquotaCbs: yup.number().optional(),
  aliquotaIbsUF: yup.number().optional(),
  aliquotaIbsMun: yup.number().optional(),
  codigoClassTrib: yup.string().optional(),
  ncm: yup.array().of(yup.string()).required('Pelo menos um NCM'),
});

export const regraTributariaValidationShema = yup.object().shape({
  ...informacoesValidationShema.fields,
});

