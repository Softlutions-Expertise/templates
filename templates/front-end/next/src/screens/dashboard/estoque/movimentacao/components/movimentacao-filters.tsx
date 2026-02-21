'use client';

import { IUseTableApi, RHFDatePicker } from '@/components';
import { IEstoqueContext, IMovimentacaoFilter, IObjectIdNome } from '@/models';
import { configuracaoEntradaService, estoqueService, mercadoriaService } from '@/services';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFSelect } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export function MovimentacaoFilters({ fetchData }: Props) {
  const { setValue, watch } =
    useFormContext<IUseTableApi<any, IMovimentacaoFilter>>();

  const extra = watch('extra');
  const { loading } = watch();
  const handleError = useError();

  const [listaFornecedores, setListaFornecedores] = useState<IObjectIdNome[]>([]);
  const [listaMercadorias, setListaMercadorias] = useState<IObjectIdNome[]>([]);
  const [context, setContext] = useState<IEstoqueContext | null>(null);

  const handleFornecedorInput = (_: any, input: string) => {
    configuracaoEntradaService
      .searchFts(input)
      .then((response) => setListaFornecedores(response?.content || []))
      .catch((err) => handleError(err, 'Erro ao buscar fornecedores'));
  };

  const handleMercadoriaInput = (_: any, input: string) => {
    mercadoriaService
      .searchFts(input)
      .then((response) => setListaMercadorias(response?.content || []))
      .catch((err) => handleError(err, 'Erro ao buscar mercadorias'));
  };

  useEffect(() => {
    configuracaoEntradaService
      .searchFts('')
      .then((response) => setListaFornecedores(response?.content || []))
      .catch((err) => handleError(err, 'Erro ao carregar fornecedores'));

    mercadoriaService
      .searchFts('')
      .then((response) => setListaMercadorias(response?.content || []))
      .catch((err) => handleError(err, 'Erro ao carregar mercadorias'));

    estoqueService
      .context()
      .then((contexto) => setContext(contexto))
      .catch((err) => handleError(err, 'Erro ao carregar contexto'));

    const hoje = new Date().toISOString().split('T')[0];
    if (!watch('extra.dataInicio')) {
      setValue('extra.dataInicio', hoje);
    }
    if (!watch('extra.dataFim')) {
      setValue('extra.dataFim', hoje);
    }
  }, []);

  const handleClearFilters = () => {
    setValue('extra.fornecedor', null);
    setValue('extra.mercadoria', null);
    Object.keys(extra as any).forEach((key) => setValue(`extra.${key as keyof IMovimentacaoFilter}`, ''));
    fetchData();
  };

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <RHFAutocomplete
            fullWidth
            name="extra.fornecedor"
            label="Fornecedor"
            size="small"
            options={listaFornecedores as any}
            getOptionLabel={(option: any) => option?.nome || ''}
            isOptionEqualToValue={(opt: any, val: any) => opt.id === val.id}
            onInputChange={handleFornecedorInput}
            noOptionsText="Nenhum fornecedor encontrado"
            value={watch('extra.fornecedor') || null}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <RHFAutocomplete
            fullWidth
            name="extra.mercadoria"
            label="Mercadoria"
            size="small"
            options={listaMercadorias as any}
            getOptionLabel={(option: any) => option?.nome || ''}
            isOptionEqualToValue={(opt: any, val: any) => opt.id === val.id}
            onInputChange={handleMercadoriaInput}
            noOptionsText="Nenhuma mercadoria encontrada"
            value={watch('extra.mercadoria') || null}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <RHFDatePicker name="extra.dataInicio" label="Data Início" size="small" />
        </Grid>

        <Grid xs={12} md={3}>
          <RHFDatePicker name="extra.dataFim" label="Data Fim" size="small" />
        </Grid>

        <Grid xs={12} md={3}>
          <RHFSelect name="extra.tipoMovimentacao" label="Tipo Movimentação" size="small" cleanFild>
            {context?.tipoMovimentacao?.map((tipo) => (
              <MenuItem key={tipo.cod} value={tipo.cod}>
                {tipo.descricao}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>

        <Grid xs={12} md={3}>
          <RHFSelect name="extra.statusMovimentacao" label="Status" size="small" cleanFild>
            {context?.statusMovimentacao?.map((status) => (
              <MenuItem key={status.cod} value={status.cod}>
                {status.descricao}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>

        <Grid xs={8} />
        <Grid xs={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end">
            <Button fullWidth variant="outlined" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
            <LoadingButton
              fullWidth
              variant="contained"
              loading={loading}
              onClick={() => {
                setValue('page', 1);
                fetchData();
              }}
            >
              Pesquisar
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
