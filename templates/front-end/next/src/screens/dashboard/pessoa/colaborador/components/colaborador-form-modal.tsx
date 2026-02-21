'use client';

import { Iconify } from '@/components';
import { IColaborador, IColaboradorShow, IColaboradorCreateUpdate, IObjectCodDescricao, IOffauthContext } from '@/models';
import { ColaboradorService, integracoesService } from '@/services';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { RHFFormProvider, RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { colaboradorResolver } from '../resolver';

// ----------------------------------------------------------------------

interface ColaboradorFormModalProps {
  open: boolean;
  currentItem: IColaborador | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ColaboradorFormModal({
  open,
  currentItem,
  onClose,
  onSuccess,
}: ColaboradorFormModalProps) {
  const handleError = useError();
  const { enqueueSnackbar } = useSnackbar();
  const [context, setContext] = useState<IOffauthContext>();
  const [loadedData, setLoadedData] = useState<IColaboradorShow | null>(null);

  const methods = colaboradorResolver(loadedData || undefined);
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    integracoesService.offauthContext().then(setContext).catch((err) => {
      handleError(err, 'Erro ao carregar contexto');
    });
  }, []);

  useEffect(() => {
    if (currentItem?.id) {
      ColaboradorService.show(currentItem.id)
        .then((response) => {
          setLoadedData(response);
          reset({
            nome: response.nome,
            username: response.username,
            perfil: response.perfil.cod,
            bloqueado: response.bloqueado,
            updatePassword: response.updatePassword,
          });
        })
        .catch((err) => {
          handleError(err, 'Erro ao carregar colaborador');
        });
    } else {
      setLoadedData(null);
      reset({
        nome: '',
        username: '',
        perfil: 0,
        bloqueado: false,
        updatePassword: false,
      });
    }
  }, [currentItem, reset, open]);

  const onSubmit = handleSubmit((data: IColaboradorCreateUpdate) => {
    if (loadedData?.id) {
      ColaboradorService.update(loadedData.id, data)
        .then(() => {
          enqueueSnackbar('Colaborador atualizado com sucesso!');
          onSuccess();
          onClose();
        })
        .catch((error) => handleError(error, 'Erro ao salvar colaborador'));
    } else {
      ColaboradorService.create(data)
        .then(() => {
          enqueueSnackbar('Colaborador cadastrado com sucesso!');
          onSuccess();
          onClose();
        })
        .catch((error) => handleError(error, 'Erro ao salvar colaborador'));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {loadedData ? 'Editar Colaborador' : 'Novo Colaborador'}
        </Typography>
      </DialogTitle>

      <RHFFormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Stack direction="row" spacing={3}>
              <RHFSwitch name="bloqueado" label="Bloqueado" />
              <RHFSwitch name="updatePassword" label="Atualizar Senha" />
            </Stack>

            <RHFTextField
              name="nome"
              label="Nome"
              fullWidth
            />

            <RHFTextField
              name="username"
              label="Login"
              fullWidth
            />

            <RHFSelect
              name="perfil"
              label="Perfil"
              fullWidth
            >
              {context?.perfil?.map((item: IObjectCodDescricao) => (
                <MenuItem key={item.cod} value={item.cod}>
                  {item.descricao}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            size="medium"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            startIcon={<Iconify icon="solar:diskette-bold" />}
            loading={isSubmitting}
          >
            Salvar
          </LoadingButton>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
