import {
  ISolicitacaoAjusteCreateUpdate,
  ISolicitacaoAjusteFinalizeForm,
  ISolicitacaoAjusteTabs,
} from '@/models';
import { pages, useRouter } from '@/routes';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { findTabWithError } from '@softlutions/utils';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { historicoValidationShema, mercadoriaValidationShema } from '../resolver';
import { SolicitacaoAjusteDialogActionAnswer } from './solicitacao-ajuste-dialog-action-answer';

// ----------------------------------------------------------------------

interface Props {
  finalizeForm: ISolicitacaoAjusteFinalizeForm;
  setFinalizeForm: (value: ISolicitacaoAjusteFinalizeForm) => void;
  setCurrentTab: (value: ISolicitacaoAjusteTabs) => void;
}

export function SolicitacaoAJusteActions({ finalizeForm, setFinalizeForm, setCurrentTab }: Props) {
  const router = useRouter();

  const { formState, watch } = useFormContext();

  const values: ISolicitacaoAjusteCreateUpdate = watch() as ISolicitacaoAjusteCreateUpdate;

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      const tabSchemas = [
        { name: 'mercadoria', keys: mercadoriaValidationShema },
        { name: 'historico', keys: historicoValidationShema },
      ];

      findTabWithError<ISolicitacaoAjusteCreateUpdate>({ tabSchemas, formState, setCurrentTab });
    }
  }, [formState.errors]);

  return (
    <Grid xs={12} mt={-3}>
      <SolicitacaoAjusteDialogActionAnswer
        finalizeForm={finalizeForm}
        setFinalizeForm={setFinalizeForm}
      />

      <Stack
        alignItems="flex-end"
        flexDirection="row"
        justifyContent="flex-end"
        sx={{ mt: 3, marginLeft: 'auto' }}
        columnGap={2}
      >
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          onClick={() => router.push(pages.dashboard.estoque.solicitacaoAjuste.list.path)}
        >
          Voltar
        </Button>
        {values.status.cod === 0 || !values.status ? (
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={() => setFinalizeForm({ ...finalizeForm, type: 'salvar' })}
            loading={finalizeForm.type === 'salvar' && finalizeForm.load}
          >
            Salvar
          </LoadingButton>
        ) : null}

        {values.status.cod === 0 && (
          <LoadingButton
            type="submit"
            variant="contained"
            color="warning"
            onClick={() => setFinalizeForm({ ...finalizeForm, type: 'enviar' })}
            loading={finalizeForm.type === 'enviar' && finalizeForm.load}
          >
            Enviar
          </LoadingButton>
        )}
        {values.status.cod === 0 && (
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            onClick={() => setFinalizeForm({ ...finalizeForm, type: 'cancelar' })}
          >
            Cancelar
          </LoadingButton>
        )}
        {values.status.cod === 1 && (
          <Button
            type="button"
            variant="contained"
            color="success"
            onClick={() => setFinalizeForm({ ...finalizeForm, type: 'responder' })}
          >
            Responder
          </Button>
        )}
      </Stack>
    </Grid>
  );
}
