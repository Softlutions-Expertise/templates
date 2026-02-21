'use client';

import { IUseTableApi, } from '@/components';
import { IConfiguracaoEntradaMercadoriaFilter, IConfiguracaoEntradaSearchFts } from '@/models';
import { configuracaoEntradaService, mercadoriaService } from '@/services';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  fetchData: () => void;
}

export function ConfiguracaoEntradaFilters({ fetchData }: Props) {
  const { setValue, watch, resetField } =
    useFormContext<IUseTableApi<any, IConfiguracaoEntradaMercadoriaFilter>>();

  const { loading } = watch();
  const handleError = useError();

  const [listaFornecedores, setListaFornecedores] = useState<IConfiguracaoEntradaSearchFts[]>([]);
  const [listaMercadorias, setListaMercadorias] = useState<IConfiguracaoEntradaSearchFts[]>([]);

  const handleConfiguracaoEntradaInput = async (_: any, input: string) => {
    try {
      const response = await configuracaoEntradaService.searchFts(input);
      setListaFornecedores(response?.content || []);
    } catch (err) {
      handleError(err, 'Erro ao buscar fornecedores');
    }
  };

  const handleMercadoriaInput = async (_: any, input: string) => {
    try {
      const response = await mercadoriaService.searchFts(input);
      setListaMercadorias(response?.content || []);
    } catch (err) {
      handleError(err, 'Erro ao buscar mercadorias');
    }
  };

  useEffect(() => {
    const loadConfiguracaoEntradaes = async () => {
      try {
        const response = await configuracaoEntradaService.searchFts('');
        setListaFornecedores(response?.content || []);
      } catch (err) {
        handleError(err, 'Erro ao carregar fornecedores');
      }
    };
    const loadMercadorias = async () => {
      try {
        const response = await mercadoriaService.searchFts('');
        setListaMercadorias(response?.content || []);
      } catch (err) {
        handleError(err, 'Erro ao carregar mercadorias');
      }
    };

    loadConfiguracaoEntradaes();
    loadMercadorias();
  }, []);

  const handleClearFilters = () => {
    resetField('extra.fornecedor');
    resetField('extra.mercadoria');
    setValue('extra.codigoBarras', '', { shouldValidate: true, shouldDirty: true });
    setValue('extra.codigoProduto', '', { shouldValidate: true, shouldDirty: true });
    fetchData();
  };

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <RHFAutocomplete
              fullWidth
              name="extra.fornecedor"
              label="Fornecedor"
              size="small"
              options={listaFornecedores}
              getOptionLabel={(option: any) => option?.nome || ''}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              onInputChange={handleConfiguracaoEntradaInput}
              noOptionsText="Nenhum fornecedor encontrado"
              value={watch('extra.fornecedor') || null}
            />

            <RHFAutocomplete
              fullWidth
              name="extra.mercadoria"
              label="Mercadoria"
              size="small"
              options={listaMercadorias}
              getOptionLabel={(option: any) => option?.nome || ''}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              onInputChange={handleMercadoriaInput}
              noOptionsText="Nenhuma mercadoria encontrada"
              value={watch('extra.mercadoria') || null}
            />

            <RHFTextField name="extra.codigoBarras" label="Código de Barras" size="small" />
            <RHFTextField name="extra.codigoProduto" label="Código Produto" size="small" />
          </Stack>
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
