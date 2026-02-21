'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, Container, MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFDatePicker, RHFSelect } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useSettingsContext } from '@/components';
import { sessaoService } from '@/services';
import { SessaoHorariosTable } from './components';

// ----------------------------------------------------------------------

interface Props {
  context?: any;
  currentData?: any;
}

export function SessaoFormInformacoesGerais({ context, currentData }: Props) {
  const settings = useSettingsContext();
  const handleError = useError();

  const [filmesOptions, setFilmesOptions] = useState<any[]>([]);

  useEffect(() => {
    const loadFilmes = async () => {
      try {
        const resp = await sessaoService.searchFilme('');
        setFilmesOptions(resp || []);
      } catch (err) {
        handleError(err, 'Erro ao carregar filmes');
      }
    };
    loadFilmes();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <RHFAutocomplete
                name="filme"
                label="Filme"
                options={filmesOptions}
                getOptionLabel={(option: any) =>
                  option?.titulo || option?.nome || option?.descricao || ''
                }
                isOptionEqualToValue={(opt: any, val: any) => opt?.id === val?.id}
                onInputChange={async (_: any, input: string) => {
                  try {
                    const resp = await sessaoService.searchFilme(input || '');
                    setFilmesOptions(resp || []);
                  } catch (err) {
                    handleError(err, 'Erro ao buscar filmes');
                  }
                }}
                noOptionsText="Nenhum filme encontrado"
                fullWidth
              />
            </Grid>

            <Grid xs={12} md={6}>
              <RHFDatePicker name="dataInicio" label="Data Início" minDate={new Date()} />
            </Grid>

            <Grid xs={12} md={6}>
              <RHFDatePicker name="dataFim" label="Data Fim" minDate={new Date()} />
            </Grid>
          </Grid>
        </Card>

        <SessaoHorariosTable context={context} />
      </Grid>
    </Container>
  );
}
