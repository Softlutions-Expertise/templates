'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, MenuItem } from '@mui/material';
import { RHFCheckbox, RHFFormProvider, RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { yup } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { salaDesignerService } from '@/services/dashboard/exibicao';
import { salaService } from '@/services';
import { ISalaContext1, IPoltronaEditDialogProps, IPoltronaFormValues, IPoltronaCreateUpdateDto } from '@/models';

// ----------------------------------------------------------------------

export function PoltronaEditDialog({
  open,
  poltrona,
  salaId,
  posicaoX,
  posicaoY,
  onClose,
  onSuccess,
}: IPoltronaEditDialogProps) {
  const handleError = useError();
  const { enqueueSnackbar } = useSnackbar();

  const [context, setContext] = useState<ISalaContext1 | null>(null);

  const isEdit = !!poltrona;

  const validationSchema = yup.object().shape({
    descricao: yup.string().required('Descrição é obrigatória'),
    posicaoX: yup.number().required('Posição X é obrigatória'),
    posicaoY: yup.number().required('Posição Y é obrigatória'),
    tipoPoltrona: yup.mixed().required('Tipo de poltrona é obrigatório'),
    tipoAcessibilidade: yup.mixed().required('Tipo de acessibilidade é obrigatório'),
    tipoBaseMapa: yup.mixed().required('Tipo base do mapa é obrigatório'),
    bloqueada: yup.boolean(),
    dupla: yup.boolean(),
    divisoriaEsquerda: yup.boolean(),
    divisoriaDireita: yup.boolean(),
  });

  const defaultValues = useMemo<IPoltronaFormValues>(() => {
    if (isEdit && poltrona) {
      return {
        descricao: poltrona.descricao,
        posicaoX: poltrona.posicaoX,
        posicaoY: poltrona.posicaoY,
        tipoPoltrona: poltrona.tipoPoltrona.cod,
        tipoAcessibilidade: poltrona.tipoAcessibilidade.cod,
        tipoBaseMapa: poltrona.tipoBaseMapa.cod,
        bloqueada: poltrona.bloqueada,
        dupla: poltrona.dupla,
        divisoriaEsquerda: poltrona.divisoriaEsquerda,
        divisoriaDireita: poltrona.divisoriaDireita,
      };
    }

    return {
      descricao: '',
      posicaoX,
      posicaoY,
      tipoPoltrona: 1,
      tipoAcessibilidade: 0,
      tipoBaseMapa: 0,
      bloqueada: false,
      dupla: false,
      divisoriaEsquerda: false,
      divisoriaDireita: false,
    };
  }, [isEdit, poltrona, posicaoX, posicaoY]);

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  useEffect(() => {
    salaService.context().then((response) => {
      setContext(response);
    }).catch((error) => {
      handleError(error, 'Erro ao carregar contexto');
    });
  }, []);

  const onSubmit = useCallback(
    (data: IPoltronaFormValues) => {
      const payload: IPoltronaCreateUpdateDto = {
        sala: salaId,
        descricao: data.descricao,
        tipoPoltrona: data.tipoPoltrona,
        tipoAcessibilidade: data.tipoAcessibilidade,
        tipoBaseMapa: data.tipoBaseMapa,
        bloqueada: data.bloqueada,
        posicaoX: data.posicaoX,
        posicaoY: data.posicaoY,
        dupla: data.dupla,
        divisoriaEsquerda: data.divisoriaEsquerda,
        divisoriaDireita: data.divisoriaDireita,
      };

      if (isEdit && poltrona?.id) {
        salaDesignerService.updatePoltrona(poltrona.id, payload)
          .then(() => {
            enqueueSnackbar('Poltrona atualizada com sucesso!');
            onSuccess();
            handleClose();
          })
          .catch((error) => {
            handleError(error, 'Erro ao atualizar poltrona');
          });
      } else {
        salaDesignerService.createPoltrona(payload)
          .then(() => {
            enqueueSnackbar('Poltrona criada com sucesso!');
            onSuccess();
            handleClose();
          })
          .catch((error) => {
            handleError(error, 'Erro ao criar poltrona');
          });
      }
    },
    [salaId, posicaoX, posicaoY, isEdit, poltrona, onSuccess, enqueueSnackbar, handleError]
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? 'Editar Poltrona' : 'Nova Poltrona'}</DialogTitle>

      <RHFFormProvider methods={methods}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <RHFTextField
              name="descricao"
              label="Descrição"
              placeholder="Ex: A01, B02, etc"
              helperText="Descrição de identificação da poltrona"
            />

            <Stack direction="row" spacing={2}>
              <RHFTextField
                name="posicaoX"
                label="Posição X"
                type="number"
                helperText="Coluna (horizontal)"
              />
              <RHFTextField
                name="posicaoY"
                label="Posição Y"
                type="number"
                helperText="Linha (vertical)"
              />
            </Stack>

            <RHFSelect
              name="tipoPoltrona"
              label="Tipo de Poltrona"
            >
              {context?.tipoPoltrona?.map((tipo) => (
                <MenuItem key={tipo.cod} value={tipo.cod}>
                  {tipo.descricao}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name="tipoAcessibilidade"
              label="Tipo de Acessibilidade"
            >
              {context?.tipoAcessibilidade?.map((tipo) => (
                <MenuItem key={tipo.cod} value={tipo.cod}>
                  {tipo.descricao}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name="tipoBaseMapa"
              label="Tipo Base do Mapa"
            >
              {context?.tipoBaseMapa?.map((tipo) => (
                <MenuItem key={tipo.cod} value={tipo.cod}>
                  {tipo.descricao}
                </MenuItem>
              ))}
            </RHFSelect>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <RHFCheckbox name="bloqueada" label="Bloqueada" />
              <RHFCheckbox name="dupla" label="Dupla" />
              <RHFCheckbox name="divisoriaEsquerda" label="Divisória Esquerda" />
              <RHFCheckbox name="divisoriaDireita" label="Divisória Direita" />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit as any)}
          >
            {isEdit ? 'Atualizar' : 'Criar'}
          </LoadingButton>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
