'use client';

import { Iconify } from '@/components';
import { useAuthContext } from '@/hooks';
import { pages, useRouter, useSearchParams } from '@/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useBoolean } from '@softlutions/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// ----------------------------------------------------------------------

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const password = useBoolean();

  const { login } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const returnTo = searchParams.get('returnTo');

  const LoginSchema = yup.object().shape({
    email: yup.string().required('Usuário é obrigatório'),
    password: yup.string().required('Password é obrigatório'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data?.email as string, data?.password as string);
      router.push(returnTo || pages.dashboard.root.path);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.response.data.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h3" textAlign="center">
        Gestão Cinelaser
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Usuário" />

      <RHFTextField
        name="password"
        label="Senha"
        type={password.value ? 'string' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        ENTRAR
      </LoadingButton>
    </Stack>
  );

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </RHFFormProvider>
  );
}
