'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Button,
  Card,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { Iconify, Scrollbar, TableNoData } from '@/components';
import { IObjectCodDescricao, ISalaContext, ISessaoContext, ISessaoHorario } from '@/models';

// ----------------------------------------------------------------------

interface Props {
  context: ISessaoContext;
}

export function SessaoHorariosTable({ context }: Props) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const values = watch();

  const getTiposPoltronaFromSala = (salaId: number | string): IObjectCodDescricao[] => {
    if (!salaId) return [];
    const sala = context?.sala?.find((s: ISalaContext) => s.id === salaId);
    return sala?.tipoPoltrona || [];
  };

  useEffect(() => {
    if (values.aplicarTodos) {
      const horarios = values.horarios || [];
      horarios.forEach((_: any, index: number) => {
        if (values.salaAll !== undefined && values.salaAll !== '') setValue(`horarios[${index}].sala`, values.salaAll);
        if (values.horaAll !== undefined && values.horaAll !== '') setValue(`horarios[${index}].hora`, values.horaAll);
        if (values.tipoSessaoAll !== undefined && values.tipoSessaoAll !== '') setValue(`horarios[${index}].tipoSessao`, values.tipoSessaoAll);
        if (values.tipoProjecaoAll !== undefined && values.tipoProjecaoAll !== '') setValue(`horarios[${index}].tipoProjecao`, values.tipoProjecaoAll);
        if (values.idiomaExibicaoAll !== undefined && values.idiomaExibicaoAll !== '') setValue(`horarios[${index}].idiomaExibicao`, values.idiomaExibicaoAll);
        if (values.resolucao4kAll !== undefined) setValue(`horarios[${index}].resolucao4k`, values.resolucao4kAll);
        if (values.atmosAll !== undefined) setValue(`horarios[${index}].atmos`, values.atmosAll);
      
      })} }, [
        values.aplicarTodos,
        values.salaAll,
        values.horaAll,
        values.tipoSessaoAll,
        values.tipoProjecaoAll,
        values.idiomaExibicaoAll,
        values.resolucao4kAll,
        values.atmosAll,
      ]);

  const handleAddHorario = () => {
    const newHorario: ISessaoHorario = {
      sala: (values.aplicarTodos && values.salaAll) || ('' as any),
      salaRendas: (values.aplicarTodos && values.salaAll) || ('' as any),
      hora: (values.aplicarTodos && values.horaAll) || '',
      tipoSessao: (values.aplicarTodos && values.tipoSessaoAll !== undefined) ? values.tipoSessaoAll : (context?.tipoSessao?.[0]?.cod || 0),
      tipoProjecao: (values.aplicarTodos && values.tipoProjecaoAll !== undefined) ? values.tipoProjecaoAll : (context?.tipoProjecao?.[0]?.cod || 0),
      idiomaExibicao: (values.aplicarTodos && values.idiomaExibicaoAll !== undefined) ? values.idiomaExibicaoAll : (context?.idiomaExibicao?.[0]?.cod || 0),
      resolucao4k: (values.aplicarTodos && values.resolucao4kAll) || false,
      atmos: (values.aplicarTodos && values.atmosAll) || false,
      libras: false,
      legendaDescritiva: false,
      audioDescricao: false,
      valoresPadrao: {},
      valoresPromocao: {},
      habilitar: true,
    };

    if (values.aplicarTodos && values.salaAll !== undefined) {
      const tiposPoltronaSala = getTiposPoltronaFromSala(values.salaAll);
      const valoresPadrao: { [key: string]: number } = {};
      const valoresPromocao: { [key: string]: number } = {};
      
      tiposPoltronaSala.forEach((tipo) => {
        valoresPadrao[tipo.cod.toString()] = 0;
        valoresPromocao[tipo.cod.toString()] = 0;
      });
      newHorario.valoresPadrao = valoresPadrao;
      newHorario.valoresPromocao = valoresPromocao;
    }
    setValue('horarios', [...(values.horarios || []), newHorario]);
  };

  const handleSalaChange = (index: number, salaId: number | string) => {
    setValue(`horarios[${index}].sala`, salaId);

    const tiposPoltronaSala = getTiposPoltronaFromSala(salaId);
    const valoresPadrao: { [key: string]: number } = {};
    const valoresPromocao: { [key: string]: number } = {};
    
    tiposPoltronaSala.forEach((tipo) => {
      valoresPadrao[tipo.cod.toString()] = 0;
      valoresPromocao[tipo.cod.toString()] = 0;
    });
    setValue(`horarios[${index}].valoresPadrao`, valoresPadrao);
    setValue(`horarios[${index}].valoresPromocao`, valoresPromocao);
  };

  const handleApplyToAll = (field: string, value: any) => {
    const horarios = values.horarios || [];
    horarios.forEach((_: any, index: number) => {
      setValue(`horarios[${index}].${field}`, value);
    });
  };

  const handleRemoveHorario = (index: number) => {
    const updatedHorarios = [...(values.horarios || [])];
    updatedHorarios.splice(index, 1);
    setValue('horarios', updatedHorarios);
  };

  const notFound = !values.horarios || values.horarios.length === 0;

  const hasPromocional = (values.horarios || []).some((h: any) => {
    const tipoSessao = context?.tipoSessao?.find((t: any) => t.cod === h.tipoSessao);
    return tipoSessao?.descricao?.toLowerCase().includes('promocional');
  });

  return (
    <Card sx={{ mt: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <Typography variant="h6">Horários</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddHorario}
        >
          Adicionar Horário
        </Button>
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 1200 }} size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#212b36' }}>
                <TableCell align="center" sx={{ width: 60, p: 0.5 }}>
                  <RHFSwitch
                    name="aplicarTodos"
                    sx={{ m: 0 }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: 50, p: 0.5 }}>
                  <RHFSwitch
                    name="resolucao4kAll"
                    sx={{ m: 0 }}
                    disabled={!values.aplicarTodos}
                    onChange={(e: any) => {
                      if (values.aplicarTodos) {
                        handleApplyToAll('resolucao4k', e.target.checked);
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: 50, p: 0.5 }}>
                  <RHFSwitch
                    name="atmosAll"
                    sx={{ m: 0 }}
                    disabled={!values.aplicarTodos}
                    onChange={(e: any) => {
                      if (values.aplicarTodos) {
                        handleApplyToAll('atmos', e.target.checked);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <RHFSelect
                    name="salaAll"
                    size="small"
                    placeholder="Sala 1"
                    disabled={!values.aplicarTodos}
                  >
                    {context?.sala?.map((s: ISalaContext) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </TableCell>
                <TableCell>
                  <RHFTextField
                    name="horaAll"
                    placeholder="HH:MM"
                    size="small"
                    mask="time"
                    disabled={!values.aplicarTodos}
                    sx={{ width: 65 }}
                  />
                </TableCell>
                <TableCell>
                  <RHFSelect
                    name="tipoSessaoAll"
                    placeholder="Fechada"
                    size="small"
                    disabled={!values.aplicarTodos}
                  >
                    {context?.tipoSessao?.map((tipo: IObjectCodDescricao) => (
                      <MenuItem key={tipo.cod} value={tipo.cod}>
                        {tipo.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </TableCell>
                <TableCell>
                  <RHFSelect
                    name="tipoProjecaoAll"
                    placeholder="3D"
                    size="small"
                    disabled={!values.aplicarTodos}
                  >
                    {context?.tipoProjecao?.map((tipo: IObjectCodDescricao) => (
                      <MenuItem key={tipo.cod} value={tipo.cod}>
                        {tipo.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </TableCell>
                <TableCell>
                  <RHFSelect
                    name="idiomaExibicaoAll"
                    size="small"
                    disabled={!values.aplicarTodos}
                  >
                    {context?.idiomaExibicao?.map((idioma: IObjectCodDescricao) => (
                      <MenuItem key={idioma.cod} value={idioma.cod}>
                        {idioma.descricao}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </TableCell>
                <TableCell>
                </TableCell>
                {hasPromocional && (
                  <TableCell>
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: 60 }}>Ações</TableCell>
                <TableCell align="center" sx={{ width: 50 }}>4K</TableCell>
                <TableCell align="center" sx={{ width: 50 }}>Atmos</TableCell>
                <TableCell>Sala</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Tipo Sessão</TableCell>
                <TableCell>Tipo Projeção</TableCell>
                <TableCell>Idioma</TableCell>
                <TableCell align='center'>Valores Convencional</TableCell>
                {hasPromocional && (
                  <TableCell align='center'>Valores Promocional</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {values.horarios?.map((horario: any, index: number) => {
                const tipoSessao = context?.tipoSessao?.find((t: any) => t.cod === horario.tipoSessao);
                const isPromocional = tipoSessao?.descricao?.toLowerCase().includes('promocional');

                return (
                  <>
                    <TableRow hover key={`horario-${index}`}>
                      <TableCell sx={{ width: 60, p: 0.5 }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveHorario(index)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 50, p: 0.5 }}>
                        <RHFSwitch name={`horarios[${index}].resolucao4k`} sx={{ m: 0 }} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 50, p: 0.5 }}>
                        <RHFSwitch name={`horarios[${index}].atmos`} sx={{ m: 0 }} />
                      </TableCell>

                      <TableCell>
                        <RHFSelect 
                          name={`horarios[${index}].sala`} 
                          size="small"
                          onChange={(e) => handleSalaChange(index, e.target.value)}
                          error={!!(errors?.horarios as any)?.[index]?.sala}
                          helperText={(errors?.horarios as any)?.[index]?.sala?.message}
                        >
                          {context?.sala?.map((s: ISalaContext) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.descricao}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </TableCell>

                      <TableCell>
                        <RHFTextField
                          name={`horarios[${index}].hora`}
                          placeholder="HH:MM"
                          size="small"
                          mask="time"
                          error={!!(errors?.horarios as any)?.[index]?.hora}
                          helperText={(errors?.horarios as any)?.[index]?.hora?.message}
                          sx={{ width: 62 }}
                        />
                      </TableCell>

                      <TableCell>
                        <RHFSelect 
                          name={`horarios[${index}].tipoSessao`} 
                          size="small"
                          error={!!(errors?.horarios as any)?.[index]?.tipoSessao}
                          helperText={(errors?.horarios as any)?.[index]?.tipoSessao?.message}
                        >
                          {context?.tipoSessao?.map((t: IObjectCodDescricao) => (
                            <MenuItem key={t.cod} value={t.cod}>
                              {t.descricao}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </TableCell>

                      <TableCell>
                        <RHFSelect 
                          name={`horarios[${index}].tipoProjecao`} 
                          size="small"
                          error={!!(errors?.horarios as any)?.[index]?.tipoProjecao}
                          helperText={(errors?.horarios as any)?.[index]?.tipoProjecao?.message}
                        >
                          {context?.tipoProjecao?.map((t: IObjectCodDescricao) => (
                            <MenuItem key={t.cod} value={t.cod}>
                              {t.descricao}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </TableCell>

                      <TableCell>
                        <RHFSelect 
                          name={`horarios[${index}].idiomaExibicao`} 
                          size="small"
                          error={!!(errors?.horarios as any)?.[index]?.idiomaExibicao}
                          helperText={(errors?.horarios as any)?.[index]?.idiomaExibicao?.message}
                        >
                          {context?.idiomaExibicao?.map((i: IObjectCodDescricao) => (
                            <MenuItem key={i.cod} value={i.cod}>
                              {i.descricao}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </TableCell>

                      <TableCell>
                        {horario.sala ? (
                          <Stack spacing={0.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              {getTiposPoltronaFromSala(horario.sala).map((tipo) => (
                                <Stack key={`padrao-${tipo.cod}-${index}`} direction="row" spacing={0.3} alignItems="center">
                                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                    {tipo.descricao}:
                                  </Typography>
                                  <RHFTextField
                                    name={`horarios[${index}].valoresPadrao.${tipo.cod}`}
                                    size="small"
                                    mask="money"
                                    placeholder="0,00"
                                    sx={{ width: 85 }}
                                    error={!!(errors?.horarios as any)?.[index]?.valoresPadrao}
                                  />
                                </Stack>
                              ))}
                            </Stack>
                            {(errors?.horarios as any)?.[index]?.valoresPadrao && (
                              <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem' }}>
                                {(errors?.horarios as any)?.[index]?.valoresPadrao?.message}
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Selecione uma sala
                          </Typography>
                        )}
                      </TableCell>

                      {isPromocional && (
                        <TableCell>
                          {horario.sala ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                              {getTiposPoltronaFromSala(horario.sala).map((tipo) => (
                                <Stack key={`promocao-${tipo.cod}-${index}`} direction="row" spacing={0.3} alignItems="center">
                                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                    {tipo.descricao}:
                                  </Typography>
                                  <RHFTextField
                                    name={`horarios[${index}].valoresPromocao.${tipo.cod}`}
                                    size="small"
                                    mask="money"
                                    placeholder="0,00"
                                    sx={{ width: 85 }}
                                  />
                                </Stack>
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Selecione uma sala
                            </Typography>
                          )}
                        </TableCell>
                      )}

                    </TableRow>
                  </>
                );
              })}

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}
