'use client';

import {
  Breadcrumbs,
  Container,
  Scrollbar,
  TableActions,
  TableNoData,
  TablePagination,
  useTableApi,
} from '@/components';
import { IConfiguracaoEntradaFindAll, IConfiguracaoEntradaMercadoriaFilter } from '@/models';
import { pages, useRouter } from '@/routes';
import { configuracaoEntradaService } from '@/services';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect } from 'react';

import { ConfiguracaoEntradaFilters } from '../components';
import { CONFIGURACAO_ENTRADA_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function ConfiguracaoEntradaListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<
    IConfiguracaoEntradaFindAll,
    IConfiguracaoEntradaMercadoriaFilter
  >({ modulo: 'configuracao-entrada' });

  const { setValue, watch, handleSubmit } = methods;

  const { dataTable, dense, extra, linesPerPage, page, search } = watch();

  const fetchData = () => {
    setValue('loading', true);

    const params = {
      page,
      linesPerPage,
    };

    const payload: IConfiguracaoEntradaMercadoriaFilter = {
      ...extra,
      fornecedor:
        typeof extra?.fornecedor === 'object'
          ? (extra.fornecedor as { id: number })?.id
          : extra?.fornecedor,
      mercadoria:
        typeof extra?.mercadoria === 'object'
          ? (extra.mercadoria as { id: number })?.id
          : extra?.mercadoria,
    };

    configuracaoEntradaService
      .findAll({ params, payload })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar configurações de entrada'))
      .finally(() => setValue('loading', false));
  };

  const handleEdit = (id: number) =>
    router.push(pages.dashboard.estoque.mercadoria.configuracaoEntrada.edit.path(id));

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
        <Breadcrumbs
          heading="Listagem de Configurações de Entrada"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Configurar Entrada',
              href: pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path,
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.estoque.mercadoria.configuracaoEntrada.create.path,
            label: 'Nova Configuração de Entrada',
          }}
        />

        <ConfiguracaoEntradaFilters fetchData={fetchData} />

        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {CONFIGURACAO_ENTRADA_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => (
                    <TableRow hover key={item?.id}>
                      <TableCell>{item.id}</TableCell>

                      <TableCell>{item.fornecedor || '- - - - - -'}</TableCell>

                      <TableCell>{item.mercadoria || '- - - - - - - - -'}</TableCell>

                      <TableCell align="center">{item.codigoBarras || '- - - - - - - -'}</TableCell>

                      <TableCell align="center">
                        {item.codigoProduto || '- - - - - - - -'}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{
                            onClick: () => handleEdit(item?.id),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>
      </RHFFormProvider>{' '}
    </Container>
  );
}
