import { ILabelColor, Label } from '@/components';
import { IEstoqueContext, ISolicitacaoAjusteCreateUpdate } from '@/models';
import { Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFTextField } from '@softlutions/components';
import { useFormContext } from 'react-hook-form';

import { SolicitacaoAjusteMercadoriaList } from './components';
import { SOLICITACAO_AJUSTE_ENUM } from './enums';

// ----------------------------------------------------------------------

interface Props {
  context: IEstoqueContext;
}
export function SolicitacaoAjusteFormMercadoria({ context }: Props) {
  const { watch } = useFormContext();

  const values: ISolicitacaoAjusteCreateUpdate = watch() as ISolicitacaoAjusteCreateUpdate;

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3, mb: 5 }}>
        <Stack>
          <Grid container spacing={3} columnSpacing={2}>
            {values?.status.descricao && (
              <Grid xs={12}>
                <strong>
                  STATUS:{' '}
                  <Label
                    color={
                      SOLICITACAO_AJUSTE_ENUM.TABLE_TABS.find(
                        (option) => option.label === values?.status.descricao,
                      )?.color as ILabelColor
                    }
                  >
                    {values?.status.descricao}
                  </Label>
                </strong>
              </Grid>
            )}
            <Grid xs={12}>
              <RHFTextField
                name="comentario"
                label="Comentário"
                multiline
                rows={4}
                disabled={values?.disabledForm}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      <SolicitacaoAjusteMercadoriaList context={context} />
    </Grid>
  );
}
