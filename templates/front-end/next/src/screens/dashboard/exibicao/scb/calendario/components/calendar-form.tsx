'use client';

import {
  Iconify,
  useSnackbar,
} from '@/components';
import { CalendarEventData, CalendarFormData, CalendarFormProps } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, DialogActions, IconButton, Stack, Tooltip } from '@mui/material';
import {
  RHFDatePicker,
  RHFFormProvider,
  RHFSwitch,
  RHFTextField,
} from '@softlutions/components';
import { useBoolean } from '@softlutions/hooks';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import ColorPicker from './color-picker';

// ----------------------------------------------------------------------

export default function CalendarForm({
  currentEvent,
  colors,
  onClose,
  onSubmit: onSubmitProp,
  onDelete: onDeleteProp,
}: CalendarFormProps) {
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    start: yup.date().required('Data de início é obrigatória'),
    end: yup
      .date()
      .required('Data de fim é obrigatória')
      .test('is-greater', 'Data de fim não pode ser menor que a data de início', function (value) {
        if (!value || !this.parent.start) return true;
        return new Date(value) >= new Date(this.parent.start);
      }),
    letivo: yup.boolean().required(),
    description: yup
      .string()
      .max(5000, 'Descrição não pode ter mais de 5000 caracteres')
      .required('Descrição é obrigatória')
      .test('no-only-spaces', 'Descrição é obrigatória', function (value) {
        return value ? value.trim().length > 0 : false;
      }),
    color: yup.string().required('Tipo de evento é obrigatório'),
    allDay: yup.boolean().required(),
  });

  const defaultValues = (event?: CalendarEventData): CalendarFormData => {
    const useDifferentTimes = event?.differentStartEnd;
    const start = useDifferentTimes ? event?.realStart : event?.start;
    const end = useDifferentTimes ? event?.realEnd : event?.end;

    return {
      allDay: start?.toString() === end?.toString(),
      start: new Date(start || new Date()),
      end: new Date(end || new Date()),
      color: event?.color || '',
      letivo: event?.letivo || false,
      description: event?.description || '',
    };
  };

  const methods = useForm<CalendarFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: defaultValues(currentEvent),
  });

  const { watch, control, handleSubmit, setValue } = methods;
  const values = watch();

  const onSubmit = handleSubmit(async (data: CalendarFormData) => {
    setLoading(true);
    try {
      if (onSubmitProp) {
        await onSubmitProp(data);
        enqueueSnackbar(currentEvent?.id ? 'Atualizado com sucesso!' : 'Criado com sucesso!');
        onClose();
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Erro ao processar evento', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  });

  const onDelete = useCallback(async () => {
    if (currentEvent?.id && onDeleteProp) {
      try {
        await onDeleteProp(currentEvent.id);
        enqueueSnackbar('Deletado com sucesso!');
        onClose();
      } catch (error: any) {
        enqueueSnackbar(error?.message || 'Erro ao deletar evento', {
          variant: 'error',
        });
      }
    }
  }, [currentEvent?.id, onDeleteProp, enqueueSnackbar, onClose]);

  useEffect(() => {
    if (values.allDay) {
      setValue('end', values.start);
    }
  }, [values.allDay, values.start, setValue]);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3, pb: 3 }}>
        <RHFSwitch name="allDay" label="Dia inteiro" />
        <RHFDatePicker name="start" label={values.allDay ? 'Data do evento' : 'Data de início'} />
        {!values.allDay && <RHFDatePicker name="end" label="Data de fim" minDate={values.start} />}

        <Controller
          name="color"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <ColorPicker
              selected={field.value}
              onSelectColor={(color) => field.onChange(color)}
              colors={colors?.map((color) => color.cor)}
              colorLabel={colors?.map((label) => label.nome)}
              error={error ? { message: error.message || 'Erro no campo' } : undefined}
            />
          )}
        />
        <RHFSwitch name="letivo" label="Dia letivo" />
        <RHFTextField name="description" label="Descrição *" multiline rows={3} />
      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title="Deletar evento">
            <IconButton
              onClick={() => {
                confirm.onTrue();
              }}
              color="error"
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>

        <LoadingButton type="submit" variant="contained" loading={loading} color="primary">
          {!!currentEvent?.id ? 'Salvar Alterações' : 'Criar Evento'}
        </LoadingButton>
      </DialogActions>
    </RHFFormProvider>
  );
}
