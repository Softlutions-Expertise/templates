'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Card, Grid, MenuItem, Stack, Typography } from '@mui/material';
import { RHFAutocomplete, RHFDatePicker, RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';

import { Container } from '@/components/container/container';
import { Guard } from '@/components';
import { IFilmeOption, IObjectCodDescricao, ISalaContext, ISessaoContext } from '@/models';
import { sessaoService } from '@/services';

// ----------------------------------------------------------------------

interface Props {
  context: ISessaoContext;
}

export function SessaoEditInformacoesGerais({ context }: Props) {
  const handleError = useError();
  const { watch } = useFormContext();
  const values = watch();

  const [filmesOptions, setFilmesOptions] = useState<IFilmeOption[]>([]);

  useEffect(() => {
    const loadFilmes = async () => {
      try {
        const resp = await sessaoService.searchFilme('');
        setFilmesOptions(resp as IFilmeOption[] || []);
      } catch (err) {
        handleError(err, 'Erro ao carregar filmes');
      }
    };
    loadFilmes();
  }, []);

  const getTiposPoltronaFromSala = (salaId: number | string): IObjectCodDescricao[] => {
    if (!salaId) return [];
    const sala = context?.sala?.find((s: ISalaContext) => s.id === salaId);
    return sala?.tipoPoltrona || [];
  };

  const tiposPoltrona = values.sala ? getTiposPoltronaFromSala(values.sala) : [];

  return (
    <Container>
      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Canais de Venda
          </Typography>

          <Stack direction="row" spacing={3}>
            <RHFSwitch name="venderPdv" label="PDV" />
            <RHFSwitch name="venderWeb" label="WEB" />
            <RHFSwitch name="venderAtm" label="ATM" />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Sessão
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="id" label="ID" disabled />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFDatePicker name="data" label="Data" />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="hora" label="Hora" mask="time" placeholder="HH:MM" />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFSelect name="tipoSessao" label="Tipo Sessão">
                {context?.tipoSessao?.map((tipo: IObjectCodDescricao) => (
                  <MenuItem key={tipo.cod} value={tipo.cod}>
                    {tipo.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFAutocomplete
                name="filme"
                label="Filme"
                options={filmesOptions}
                getOptionLabel={(option: IFilmeOption | string) => {
                  if (typeof option === 'string') return option;
                  return option?.titulo || option?.nome || option?.descricao || '';
                }}
                isOptionEqualToValue={(opt: IFilmeOption, val: IFilmeOption) => 
                  (opt?.id || opt?.cod) === (val?.id || val?.cod)
                }
                onInputChange={async (_: any, input: string) => {
                  try {
                    const resp = await sessaoService.searchFilme(input || '');
                    setFilmesOptions(resp as IFilmeOption[] || []);
                  } catch (err) {
                    handleError(err, 'Erro ao buscar filmes');
                  }
                }}
                noOptionsText="Nenhum filme encontrado"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFSelect name="sala" label="Sala">
                {context?.sala?.map((s: ISalaContext) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Guard roles={['supervisor', 'admin', 'master']}>
              <Grid item xs={12} md={3}>
                <RHFSelect name="salaRendas" label="Sala Rendas">
                  {context?.sala?.map((sala: ISalaContext) => (
                    <MenuItem key={sala.id} value={sala.id}>
                      {sala.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Guard>

            <Grid item xs={12} md={3}>
              <RHFSelect name="tipoProjecao" label="Tipo Projeção">
                {context?.tipoProjecao?.map((tipo: IObjectCodDescricao) => (
                  <MenuItem key={tipo.cod} value={tipo.cod}>
                    {tipo.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFSelect name="idiomaExibicao" label="Idioma">
                {context?.idiomaExibicao?.map((idioma: IObjectCodDescricao) => (
                  <MenuItem key={idioma.cod} value={idioma.cod}>
                    {idioma.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFSwitch name="resolucao4k" label="Resolução 4K" />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFSwitch name="atmos" label="Atmos" />
            </Grid>
          </Grid>

          {tiposPoltrona.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                Valores
              </Typography>

              <Grid container spacing={3}>
                {tiposPoltrona.map((tipo: IObjectCodDescricao) => (
                  <>
                    <Grid item xs={12} md={3} key={`padrao-${tipo.cod}`}>
                      <RHFTextField
                        name={`valoresPadrao.${tipo.cod}`}
                        label={`${tipo.descricao} Convencional`}
                        mask="money"
                        placeholder="0,00"
                      />
                    </Grid>

                    <Grid item xs={12} md={3} key={`promocao-${tipo.cod}`}>
                      <RHFTextField
                        name={`valoresPromocao.${tipo.cod}`}
                        label={`${tipo.descricao} Promocional`}
                        mask="money"
                        placeholder="0,00"
                      />
                    </Grid>
                  </>
                ))}
              </Grid>
            </>
          )}

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Acessibilidade
          </Typography>

          <Stack spacing={2} direction="row">
            <RHFSwitch name="legendaDescritiva" label="Legenda Descritiva" />
            <RHFSwitch name="audioDescricao" label="Audio Descrição" />
            <RHFSwitch name="libras" label="Libras" />
          </Stack>
        </Card>
      </Grid>
    </Container>
  );
}
