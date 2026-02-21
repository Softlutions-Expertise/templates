import { yup } from '@softlutions/utils';

// ----------------------------------------------------------------------

export const colaboradorValidationSchema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  username: yup
    .string()
    .required('Login é obrigatório')
    .test('no-spaces', 'Login não pode conter espaços', (value) => {
      return !value || !/\s/.test(value);
    }),
  perfil: yup.mixed().required('Perfil é obrigatório'),
  bloqueado: yup.boolean(),
  updatePassword: yup.boolean(),
});
