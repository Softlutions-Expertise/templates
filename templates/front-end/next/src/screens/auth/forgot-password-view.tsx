'use client';

import { Iconify, } from '@/components';
import { pages, useRouter } from '@/routes';
import { PasswordService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { PasswordIcon } from '@/assets/icons';

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [loader, setLoader] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false);

  const ForgotPasswordSchema = yup.object().shape({
    senha: yup.string().required('Senha é obrigatória'),
    confirmarSenha: yup
      .string()
      .required('Confirmar senha é obrigatória')
      .test('senhas-iguais', 'As senhas devem ser iguais', function (value) {
        return this.parent.senha === value;
      }),
  });

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const { handleSubmit } = methods;

  const handleCreat = async (data: Record<string, any>) => {
    PasswordService.update(data.senha)
      .then(() => {
        enqueueSnackbar('Senha atualizada com sucesso');
        setTimeout(() => {
          router.push(pages.auth.login.path);
        }, 2000);
      })
      .catch(() => {
        enqueueSnackbar('Senha não atualizada', {
          variant: 'error',
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoader(true);
      handleCreat(data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack>
      <RHFTextField
        sx={{ mb: 2 }}
        name="senha"
        label="Senha"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <RHFTextField
        sx={{ mb: 2 }}
        name="confirmarSenha"
        label="Confirmar senha"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmarPassword(!showConfirmarPassword)}
                edge="end"
              >
                <Iconify icon={showConfirmarPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={loader}
        sx={{ mt: 3 }}
      >
        Trocar senha
      </LoadingButton>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Typography variant="h3" paragraph>
        Atualização de senha
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Crie uma nova senha, diferente da padrão criada pela equipe de desenvolvimento.
      </Typography>
    </>
  );

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </RHFFormProvider>
  );
}
