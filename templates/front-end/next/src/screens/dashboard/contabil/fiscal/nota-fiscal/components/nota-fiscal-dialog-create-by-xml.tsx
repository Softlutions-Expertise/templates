'use client';
import { RHFUploadBox } from '@/components';
import { pages, useRouter } from '@/routes';
import { notaFiscalService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  confirm: boolean;
  setCofirm: (value: boolean) => void;
}
export function NotaFiscalDialogCreateByXml({ confirm, setCofirm }: Props) {
  const router = useRouter();
  const handleError = useError();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [activateForm, setActivateForm] = useState<boolean>();

  const validationSchema = yup.object().shape({
    file: yup.mixed().nonNullable('Arquivo é obrigatório'),
  });

  const defaultValues = useMemo(() => {
    return {
      file: null,
    };
  }, []);

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
  });

  const { reset, setValue, watch } = methods;

  const values = watch();

  const onSubmit = useCallback(async (data: any) => {
    setLoading(true);
    handleCreate(data);
  }, []);

  const handleCreate = (data: any) => {
    notaFiscalService
      .creteByXml(data.file)
      .then((response) => {
        enqueueSnackbar('Criado com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.notaFiscal.edit.path(response.id));
      })
      .catch((error) => handleError(error, 'Erro ao criar nota fiscal!'))
      .finally(() => handleClose());
  };

  const handleClose = () => {
    setCofirm(false);
    setLoading(false);
    reset();
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) setValue('file', newFile as any, { shouldValidate: true });
  }, []);

  return (
    <Dialog fullWidth maxWidth="xs" open={confirm} onClose={handleClose}>
      <RHFFormProvider
        methods={methods}
        onSubmit={onSubmit}
        activateForm={activateForm}
        setActivateForm={setActivateForm}
      >
        <DialogContent sx={{ mt: 3 }}>
          <Stack spacing={3} alignItems={'center'} textAlign={'center'}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Arquivo XML
            </Typography>
            <RHFUploadBox name="file" onDrop={handleDrop} />
            {values.file && (
              <Typography variant="caption" sx={{ color: 'green' }}>
                Arquivo adicionado
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <LoadingButton
            type="button"
            variant="contained"
            onClick={() => setActivateForm(true)}
            loading={loading}
          >
            Criar e editar
          </LoadingButton>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
