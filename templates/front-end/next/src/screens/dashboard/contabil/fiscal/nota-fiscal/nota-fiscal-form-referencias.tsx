import { Iconify } from '@/components';
import { INotaFiscalCreateUpdate } from '@/models';
import { Button, Card, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFTextField } from '@softlutions/components';
import { useFieldArray, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

export function NotaFiscalFormReferencias() {
  const { control, formState } = useFormContext<INotaFiscalCreateUpdate>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chaveAcessoReferenciada' as any,
  });

  console.log(formState.errors);

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                Chaves de Acesso Referenciadas
              </Typography>

              {fields.map((item, index) => (
                <Stack key={item.id} direction="row" spacing={2} alignItems="center" sx={{ my: 1 }}>
                  <RHFTextField
                    name={`chaveAcessoReferenciada.${index}`}
                    label={`${index + 1}ª Chave de Acesso`}
                    mask="chaveAcessoReferenciada"
                  />
                  {fields.length > 1 && (
                    <IconButton color="error" onClick={() => remove(index)}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  )}
                </Stack>
              ))}

              {/* Botão para adicionar mais chaves */}
              <Button
                variant="text"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append('')}
                sx={{ mt: 1 }}
              >
                Adicionar chave
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
