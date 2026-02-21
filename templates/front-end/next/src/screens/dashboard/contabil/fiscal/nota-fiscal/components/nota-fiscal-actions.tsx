import { useEffect } from 'react';
import { ConfirmDialog } from '@/components';
import { INotaFiscalCreateUpdate, INotaFiscalFinalizeForm } from '@/models';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { FaFileAlt, FaSave } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdCloudUpload, MdOutlineMail } from 'react-icons/md';
import { TbFileText } from 'react-icons/tb';
import { HiDocumentText } from 'react-icons/hi';

import { NotaFiscalDialogActionCancelar } from './nota-fiscal-dialog-action-cancelar';
import { NotaFiscalDialogActionCartaCorrecao } from './nota-fiscal-dialog-action-carta-correcao';

// ----------------------------------------------------------------------

interface Props {
  finalizeForm: INotaFiscalFinalizeForm;
  setFinalizeForm: (value: INotaFiscalFinalizeForm) => void;
  currentData?: INotaFiscalCreateUpdate;
}

export function NotaFiscalActions({ finalizeForm, setFinalizeForm, currentData }: Props) {
  const { watch } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (!currentData) {
      setFinalizeForm({
        ...finalizeForm,
        disabled: { transmitir: true, cancelar: true, excluir: true, danfe: true },
      });
    }
  }, []);

  return (
    <>
      <Grid xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={3}>
            <Grid container spacing={2} columnSpacing={2}>
              <Grid xs={12}>
                <Stack spacing={1.8} direction={{ xs: 'column', md: 'row' }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={<FaSave />}
                    sx={{ color: 'white' }}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'salvar' })}
                    disabled={values?.status == 'Autorizada' || values?.status == 'Cancelada'}
                    loading={finalizeForm.type === 'salvar' && finalizeForm.load}
                    fullWidth
                  >
                    Salvar
                  </LoadingButton>

                  <LoadingButton
                    variant="contained"
                    color="warning"
                    startIcon={<TbFileText />}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'cartaCorrecao' })}
                    loading={finalizeForm.type === 'cartaCorrecao' && finalizeForm.load}
                    disabled={values?.status !== 'Autorizada'}
                    sx={{ color: 'white' }}
                    fullWidth
                  >
                    Carta Correção
                  </LoadingButton>

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    startIcon={<FaFileAlt />}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'danfe' })}
                    loading={finalizeForm.type === 'danfe' && finalizeForm.load}
                    disabled={finalizeForm?.disabled?.danfe || values?.status !== 'Autorizada'}
                    fullWidth
                  >
                    DANFE
                  </LoadingButton>

                  <Button startIcon={<MdOutlineMail />} variant="contained" fullWidth disabled>
                    Enviar email
                  </Button>
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack spacing={1.8} direction={{ xs: 'column', md: 'row' }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="info"
                    startIcon={<MdCloudUpload />}
                    sx={{ color: 'white' }}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'transmitir' })}
                    disabled={
                      finalizeForm?.disabled?.transmitir ||
                      values?.status == 'Autorizada' ||
                      values?.status == 'Cancelada'
                    }
                    loading={finalizeForm.type === 'transmitir' && finalizeForm.load}
                    fullWidth
                  >
                    Transmitir
                  </LoadingButton>

                  <LoadingButton
                    variant="contained"
                    color="warning"
                    startIcon={<IoIosCloseCircle />}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'cancelar' })}
                    loading={finalizeForm.type === 'cancelar' && finalizeForm.load}
                    disabled={finalizeForm?.disabled?.cancelar || values?.status !== 'Autorizada'}
                    sx={{ color: 'white' }}
                    fullWidth
                  >
                    Cancelar
                  </LoadingButton>

                  <LoadingButton
                    variant="contained"
                    startIcon={<HiDocumentText />}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'xmlAutorizado', load: true })}
                    loading={finalizeForm.type === 'xmlAutorizado' && finalizeForm.load}
                    disabled={values?.status !== 'Autorizada'}
                    fullWidth
                  >
                    XML Autorizado
                  </LoadingButton>

                  <LoadingButton
                    variant="contained"
                    color="error"
                    startIcon={<FaTrash />}
                    onClick={() => setFinalizeForm({ ...finalizeForm, type: 'excluir' })}
                    disabled={finalizeForm?.disabled?.excluir}
                    fullWidth
                  >
                    Excluir
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Grid>

      <NotaFiscalDialogActionCancelar
        finalizeForm={finalizeForm}
        setFinalizeForm={setFinalizeForm}
        currentData={currentData}
      />

      <NotaFiscalDialogActionCartaCorrecao
        finalizeForm={finalizeForm}
        setFinalizeForm={setFinalizeForm}
        currentData={currentData}
      />

      <ConfirmDialog
        open={finalizeForm.type === 'excluir'}
        onClose={() => setFinalizeForm({ ...finalizeForm, type: 'default' })}
        title="Excluir"
        content={
          <>
            Deseja excluir a nota fiscal <strong>{values?.id}</strong>?
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => setFinalizeForm({ ...finalizeForm, load: true })}
            loading={finalizeForm.type === 'excluir' && finalizeForm.load}
          >
            Sim, excluir
          </LoadingButton>
        }
      />
    </>
  );
}
