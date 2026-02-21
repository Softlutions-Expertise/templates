'use client';

import {
  IConfiguracaoEntradaCreateUpdate,
  IConfiguracaoEntradaSearchFts,
  IEstoqueContext,
} from '@/models';
import { configuracaoEntradaService, estoqueService, mercadoriaService } from '@/services';
import { Card, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFAutocomplete, RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IConfiguracaoEntradaCreateUpdate;
}

export function ConfiguracaoEntradaFormInformacoesGerais({ currentData }: Props) {
  const handleError = useError();

  const [context, setContext] = useState<IEstoqueContext>();
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

    estoqueService.context().then((response) => setContext(response));

    loadConfiguracaoEntradaes();
    loadMercadorias();
  }, []);

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFAutocomplete
                name="fornecedor"
                label="Fornecedor"
                options={listaFornecedores}
                getOptionLabel={(option: any) => option?.nome || ''}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                onInputChange={handleConfiguracaoEntradaInput}
                noOptionsText="Nenhum fornecedor encontrado"
                fullWidth
              />
              <RHFAutocomplete
                name="mercadoriaLocal"
                label="Mercadoria"
                options={listaMercadorias}
                getOptionLabel={(option: any) => option?.nome || ''}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                onInputChange={handleMercadoriaInput}
                noOptionsText="Nenhuma mercadoria encontrada"
                fullWidth
              />
              <RHFTextField name="unidadeMedidaOrigem" label="Unidade de Medida de Origem" />
              <RHFSelect name="unidadeMedidaDestino" label="Unidade de Medida de Destino">
                {context?.unidadeMedida?.map((item) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="codigoProduto" label="Código do Produto" max={20} />
              <RHFTextField name="codigoBarras" label="Código de Barras" max={20} />
              <RHFTextField
                name="fatorConversao"
                label="Fator de Conversão"
                mask="number"
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <RHFTextField name="descricao" label="Descrição" />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
