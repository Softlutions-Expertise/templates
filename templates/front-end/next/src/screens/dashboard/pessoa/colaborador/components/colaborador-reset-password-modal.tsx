'use client';

import { Iconify } from '@/components';
import { IColaborador } from '@/models';
import { ColaboradorService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { RHFFormProvider, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

interface ColaboradorResetPasswordModalProps {
  open: boolean;
  currentItem: IColaborador | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  password?: string;
  confirmPassword?: string;
}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas não correspondem'),
});

export function ColaboradorResetPasswordModal({
  open,
  currentItem,
  onClose,
  onSuccess,
}: ColaboradorResetPasswordModalProps) {
  const handleError = useError();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!currentItem?.usuario?.usuario || !data.password) return;

    try {
      await ColaboradorService.changePassword({
        username: currentItem.usuario.usuario,
        password: data.password,
      });
      enqueueSnackbar('Senha redefinida com sucesso!');
      onSuccess();
      handleClose();
    } catch (error) {
      handleError(error, 'Erro ao redefinir senha');
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Redefinir Senha</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Usuário: <strong>{currentItem?.usuario?.usuario}</strong>
        </Typography>
      </DialogTitle>

      <RHFFormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <RHFTextField
              name="password"
              label="Nova Senha"
              type={showPassword ? 'string' : 'password'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="confirmPassword"
              label="Confirmar Nova Senha"
              type={showConfirmPassword ? 'string' : 'password'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={handleClose} size="medium" disabled={isSubmitting}>
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            startIcon={<Iconify icon="solar:lock-password-bold" />}
            loading={isSubmitting}
          >
            Redefinir Senha
          </LoadingButton>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
