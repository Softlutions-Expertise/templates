import { yup } from '@softlutions/utils';

export const informacoesGeraisValidationShema = yup.object().shape({
  filme: yup.mixed().required('Filme é obrigatório'),
  dataInicio: yup.date().typeError('Data Início é obrigatória').required('Data Início é obrigatória'),
  dataFim: yup.date().typeError('Data Fim é obrigatória').required('Data Fim é obrigatória'),
  horarios: yup
    .array()
    .min(1, 'Ao menos um horário é obrigatório')
    .of(
      yup.object().shape({
        sala: yup.mixed().test('is-required', 'Sala é obrigatória', (value) => value !== '' && value != null),
        hora: yup.string().required('Hora'),
        tipoSessao: yup.number().required('Tipo Sessão é obrigatório'),
        tipoProjecao: yup.number().required('Tipo Projeção é obrigatório'),
        idiomaExibicao: yup.number().required('Idioma é obrigatório'),
        atmos: yup.boolean(),
        valoresPadrao: yup
          .object()
          .test('all-values-required', 'Todos os valores devem ser preenchidos', (value) => {
            if (!value || typeof value !== 'object') return true;
            const values = Object.values(value);
            if (values.length === 0) return true; 
            return values.every((v) => typeof v === 'number' && v > 0);
          }),
      })
    ),
});

export const sessaoEditValidationShema = yup.object().shape({
  filme: yup.mixed().required('Filme é obrigatório'),
  data: yup.date().typeError('Data é obrigatória').required('Data é obrigatória'),
  hora: yup.string().required('Hora é obrigatória'),
  sala: yup.mixed().test('is-required', 'Sala é obrigatória', (value) => value !== '' && value != null),
  salaRendas: yup.mixed().nullable().optional(),
  tipoSessao: yup.number().required('Tipo Sessão é obrigatório'),
  tipoProjecao: yup.number().required('Tipo Projeção é obrigatório'),
  idiomaExibicao: yup.number().required('Idioma é obrigatório'),
  valoresPadrao: yup
    .object()
    .test('all-values-required', 'Todos os valores devem ser preenchidos', (value) => {
      if (!value || typeof value !== 'object') return true;
      const values = Object.values(value);
      if (values.length === 0) return true;
      return values.every((v) => typeof v === 'number' && v > 0);
    }),
});

export const SessaoValidationShema = yup.object().shape({
  ...informacoesGeraisValidationShema.fields,
});
