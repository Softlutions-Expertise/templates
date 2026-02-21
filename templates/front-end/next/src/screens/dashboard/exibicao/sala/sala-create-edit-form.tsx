'use client';

import { Breadcrumbs, Container } from '@/components';
import { ISala, ISalaContext1, IObjectCodDescricao } from '@/models';
import { pages, useRouter } from '@/routes';
import { salaService, sessaoService } from '@/services';
import { RHFFormProvider, RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { Button, Card, Grid, MenuItem, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { salaResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISala;
}

export function SalaCreateEditForm({ currentData }: Props) {
  const handleError = useError();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<ISalaContext1 | null>(null);

  const methods = salaResolver(currentData);
  const { handleSubmit } = methods;

  const isEdit = !!currentData?.id;

  useEffect(() => {
    salaService.context().then((response) => setContext(response));
  }, []);

  const onSubmit = handleSubmit(async (data: ISala) => {
    setLoading(true);

    try {
      if (isEdit && currentData?.id) {
        await salaService.update(currentData.id, data);
        enqueueSnackbar('Sala atualizada com sucesso!');
      } else {
        await salaService.create(data);
        enqueueSnackbar('Sala criada com sucesso!');
      }
      router.push(pages.dashboard.exibicao.sala.list.path);
    } catch (error) {
      handleError(error, `Erro ao ${isEdit ? 'atualizar' : 'criar'} sala!`);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={onSubmit}>
        <Breadcrumbs
          heading={isEdit ? 'Editar Sala' : 'Nova Sala'}
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Salas',
              href: pages.dashboard.exibicao.sala.list.path,
            },
            { name: isEdit ? 'Editar' : 'Nova' },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informações da Sala
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={3}>
                <RHFSwitch name="resolucao4k" label="Resolução 4K" />
                <RHFSwitch name="atmos" label="Dolby Atmos" />
                <RHFSwitch name="inverterY" label="Inverter Eixo Y" />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="descricao" label="Descrição" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="registroAncine" label="Registro ANCINE" />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFSelect
                name="tipoTela"
                label="Tipo de Tela"
              >
                <MenuItem value={0}>Selecione...</MenuItem>
                {context?.tipoTela?.map((item: IObjectCodDescricao) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="tamanhoX"
                label="Tamanho X"
                mask='number'
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="tamanhoY"
                label="Tamanho Y"
                mask='number'
              />
            </Grid>
          </Grid>
        </Card>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => router.push(pages.dashboard.exibicao.sala.list.path)}
          >
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
          >
            {isEdit ? 'Atualizar' : 'Cadastrar'}
          </LoadingButton>
        </Stack>
      </RHFFormProvider>
    </Container>
  );
}
