'use client';

import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  isView?: boolean;
}

export function RegraTributariaFormInformacoes({ isView }: Props) {
  const { setValue } = useFormContext();
  const ncmList = useWatch({ name: 'ncm' }) || [];
  const [newNcm, setNewNcm] = useState('');

  const handleAddNcm = () => {
    if (newNcm.trim() && !ncmList.includes(newNcm.trim())) {
      const updatedList = [...ncmList, newNcm.trim()];
      setValue('ncm', updatedList);
      setNewNcm('');
    }
  };

  const handleRemoveNcm = (ncmToRemove: string) => {
    const updatedList = ncmList.filter((ncm: string) => ncm !== ncmToRemove);
    setValue('ncm', updatedList);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddNcm();
    }
  };

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6">Informações da Regra Tributária</Typography>
            </Grid>

            <Grid xs={12}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <RHFTextField
                  name="descricao"
                  label="Descrição"
                  readOnly={isView}
                  sx={{ minWidth: '49.4%' }}
                />
                <RHFTextField
                  name="codigoBeneficioFiscal"
                  label="Código Benefício Fiscal"
                  readOnly={isView}
                />
                <RHFTextField name="cfopSaida" label="CFOP Saída" readOnly={isView} />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <RHFTextField name="icmsCstCsosn" label="ICMS CST/CSOSN" readOnly={isView} />{' '}
                <RHFTextField name="pisCst" label="PIS CST" readOnly={isView} />
                <RHFTextField name="cofinsCst" label="COFINS CST" readOnly={isView} />{' '}
                <RHFTextField name="ibsCbsCst" label="IBS/CBS CST" readOnly={isView} />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <RHFTextField
                  name="porcentagemReducaoBaseCalculoIcms"
                  label="% Redução BC ICMS"
                  mask="percentage"
                  readOnly={isView}
                />
                <RHFTextField
                  name="porcentagemReducaoBaseCalculoPis"
                  label="% Redução BC PIS"
                  mask="percentage"
                  readOnly={isView}
                />
                <RHFTextField
                  name="porcentagemReducaoBaseCalculoCofins"
                  label="% Redução BC COFINS"
                  mask="percentage"
                  readOnly={isView}
                />
                <RHFTextField
                  name="porcentagemReducaoBaseCalculoIbsCbs"
                  label="% Redução BC IBS/CBS"
                  mask="percentage"
                  readOnly={isView}
                />
              </Stack>
            </Grid>

            <Grid xs={12}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <RHFTextField
                  name="aliquotaIcms"
                  label="Alíquota ICMS (%)"
                  mask="percentage"
                  readOnly={isView}
                />
                <RHFTextField
                  name="aliquotaPis"
                  label="Alíquota PIS (%)"
                  mask="percentage"
                  readOnly={isView}
                />
                <RHFTextField
                  name="aliquotaCofins"
                  label="Alíquota COFINS (%)"
                  mask="percentage"
                  readOnly={isView}
                />
                <RHFTextField
                  name="aliquotaCbs"
                  label="Alquota CBS (%)"
                  mask="percentage"
                  readOnly={isView}
                />
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                name="aliquotaIbsUF"
                label="Alíquota IBS UF (%)"
                mask="percentage"
                readOnly={isView}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                name="aliquotaIbsMun"
                label="Alíquota IBS Municipal (%)"
                mask="percentage"
                readOnly={isView}
              />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                name="codigoClassTrib"
                label="Código Classificação Tributária"
                readOnly={isView}
              />
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                NCM
              </Typography>

              {!isView && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Código NCM"
                    value={newNcm}
                    onChange={(e) => {
                      // Permite apenas números
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      setNewNcm(numericValue);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite o código NCM"
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddNcm}
                    startIcon={<AddIcon />}
                    sx={{ minWidth: 120 }}
                  >
                    Adicionar
                  </Button>
                </Box>
              )}

              {ncmList.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>NCM</TableCell>
                        {!isView && <TableCell width={80}>Ações</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ncmList.map((ncm: string, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{ncm}</TableCell>
                          {!isView && (
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveNcm(ncm)}
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

              {ncmList.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, fontStyle: 'italic' }}
                >
                  Nenhum código NCM adicionado
                </Typography>
              )}
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
