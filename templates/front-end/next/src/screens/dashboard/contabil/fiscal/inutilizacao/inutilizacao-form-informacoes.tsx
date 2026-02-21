'use client';

import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
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
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { RHFSelect, RHFTextField } from '@softlutions/components';
import { IFiscalContext, IInutilizacaoSequencia } from '@/models';
import { Label } from '@/components';

// ----------------------------------------------------------------------

interface Props {
  context?: IFiscalContext;
  isView?: boolean;
}

export function InutilizacaoFormInformacoes({ context, isView }: Props) {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const sequencias = useWatch({ name: 'sequencias' }) || [];
  const [numeracaoInicial, setNumeracaoInicial] = useState<string>('');
  const [numeracaoFinal, setNumeracaoFinal] = useState<string>('');

  const handleAddSequencia = () => {
    if (numeracaoInicial && parseInt(numeracaoInicial) > 0) {
      const newSequencia: IInutilizacaoSequencia = {
        numeracaoInicial: parseInt(numeracaoInicial),
        numeracaoFinal: numeracaoFinal ? parseInt(numeracaoFinal) : null,
      };

      if (
        newSequencia.numeracaoFinal !== null &&
        newSequencia.numeracaoFinal < newSequencia.numeracaoInicial
      ) {
        return;
      }

      const updatedList = [...sequencias, newSequencia];
      setValue('sequencias', updatedList);
      setNumeracaoInicial('');
      setNumeracaoFinal('');
    }
  };

  const handleRemoveSequencia = (index: number) => {
    const updatedList = sequencias.filter((_: any, i: number) => i !== index);
    setValue('sequencias', updatedList);
  };

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Informações da Inutilização</Typography>
                {isView && (
                  <Label variant="soft" color={getValues('autorizado') ? 'success' : 'error'}>
                    {getValues('autorizado') ? 'Autorizado' : 'Não Autorizado'}
                  </Label>
                )}
              </Stack>
            </Grid>

            {isView && (
              <>
                <Grid xs={12}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <RHFTextField name="dataHora" label="Data/Hora" readOnly />
                    <RHFTextField name="modelo" label="Modelo" readOnly />
                    <RHFTextField name="serie" label="Série" type="number" readOnly />
                  </Stack>
                </Grid>

                <Grid xs={12}>
                  <RHFTextField name="justificativa" label="Justificativa" readOnly />
                </Grid>

                <Grid xs={12}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <RHFTextField name="ambiente" label="Ambiente" readOnly />
                    <RHFTextField name="status" label="Status" readOnly />
                    <RHFTextField name="protocolo" label="Protocolo" readOnly />
                  </Stack>
                </Grid>
                
                <Grid xs={12}>
                  <RHFTextField name="detalhes" label="Detalhes" readOnly />
                </Grid>
              </>
            )}

            {!isView && (
              <>
                <Grid xs={12}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <RHFSelect name="modelo" label="Modelo">
                      {context?.modeloDocumentoFiscal?.map((item) => (
                        <MenuItem key={item.cod} value={item.cod}>
                          {item.descricao}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <RHFTextField name="serie" label="Série" type="number" />
                  </Stack>
                </Grid>

                <Grid xs={12}>
                  <RHFTextField
                    name="justificativa"
                    label="Justificativa"
                    multiline
                    rows={3}
                    placeholder="Descreva o motivo da inutilização (mínimo 15 caracteres)"
                  />
                </Grid>
              </>
            )}

            <Grid xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sequências de Numeração
              </Typography>

              {!isView && (
                <Box sx={{ mb: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <RHFTextField
                      name="numeracaoInicialTemp"
                      label="Numeração Inicial"
                      mask="number"
                      value={numeracaoInicial}
                      onChange={(e) => setNumeracaoInicial(e.target.value)}
                      placeholder="Digite a numeração inicial"
                    />
                    <RHFTextField
                      name="numeracaoFinalTemp"
                      label="Numeração Final (opcional)"
                      mask="number"
                      value={numeracaoFinal}
                      onChange={(e) => setNumeracaoFinal(e.target.value)}
                      placeholder="Digite a numeração final ou deixe em branco"
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSequencia}
                      startIcon={<AddIcon />}
                      sx={{ minWidth: 140, height: 56 }}
                    >
                      Adicionar
                    </Button>
                  </Stack>
                </Box>
              )}

              {sequencias.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Numeração Inicial</TableCell>
                        <TableCell>Numeração Final</TableCell>
                        {!isView && <TableCell width={80}>Ações</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sequencias.map((seq: IInutilizacaoSequencia, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{seq.numeracaoInicial}</TableCell>
                          <TableCell>
                            {seq.numeracaoFinal !== null ? seq.numeracaoFinal : '-'}
                          </TableCell>
                          {!isView && (
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveSequencia(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {sequencias.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, fontStyle: 'italic' }}
                >
                  Nenhuma sequência adicionada
                </Typography>
              )}

              {errors.sequencias && (
                <Typography variant="caption" color="error" sx={{ ml: 1, mt: 1, display: 'block' }}>
                  {errors.sequencias.message as string}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
