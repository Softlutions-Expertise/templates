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
import { INotaFiscalFindAll, INotaFiscalFindAllFilter } from '@/models';
import { pages, useRouter } from '@/routes';
import { notaFiscalService } from '@/services';
import {
  Card,
  Stack,
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
import { fDate } from '@softlutions/utils';
import { useEffect } from 'react';

import { NotaFiscalDialogActionList, NotaFiscalPopperActions } from '../components';
import { NotaFiscalFilters } from '../components/nota-fiscal-filters';
import { NOTA_FISCAL_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function NotaFiscalListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<INotaFiscalFindAll, INotaFiscalFindAllFilter>({ modulo: 'nota-fiscal' });

  const { setValue, watch, handleSubmit } = methods;

  const { dataTable, dense, extra, linesPerPage, page, search } = watch();

  const fetchData = () => {
    setValue('loading', true);

    const params = {
      page,
      linesPerPage,
    };

    const payload: INotaFiscalFindAllFilter = {
      ...extra,
      dataInicio: fDate('yyyy-MM-dd', extra?.dataInicio),
      dataFim: fDate('yyyy-MM-dd', extra?.dataFim),
    };

    notaFiscalService
      .findAll({ params, payload })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar nota fiscal'))
      .finally(() => setValue('loading', false));
  };

  const handleEdit = (id: number) =>
    router.push(pages.dashboard.contabil.fiscal.notaFiscal.edit.path(id));

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
        <Breadcrumbs
          heading="Listagem de Notas Fiscais"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            { name: 'Notas Fiscais', href: pages.dashboard.contabil.fiscal.notaFiscal.list.path },
            { name: 'Lista' },
          ]}
          action={<NotaFiscalPopperActions />}
        />

        <NotaFiscalFilters fetchData={fetchData} />

        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {NOTA_FISCAL_ENUM.TABLE_HEADER.map((item) => (
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

                      <TableCell align="center">
                        {item.tipoMovimento?.descricao || '- - - - - -'}
                      </TableCell>
                      <TableCell>{item.status?.descricao || '- - - - - - - - -'}</TableCell>

                      <TableCell>{item.nome || '- - - - - - - -'}</TableCell>

                      <TableCell align="center">{item.serie || '-'}</TableCell>

                      <TableCell align="center">{item.numero || '- - - -'}</TableCell>

                      <TableCell>{item.dataHoraEmissao || '- - - - - - - - - - - - - -'}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <TableActions
                            row={item}
                            edit={{
                              onClick: () => handleEdit(item?.id),
                            }}
                          />
                          <NotaFiscalDialogActionList row={item} fetchData={fetchData} />
                        </Stack>
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
