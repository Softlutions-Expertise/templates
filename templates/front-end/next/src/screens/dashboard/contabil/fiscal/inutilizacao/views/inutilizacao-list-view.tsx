'use client';

import {
  Breadcrumbs,
  Container,
  Label,
  Scrollbar,
  TableActions,
  TableFilter,
  TableNoData,
  TablePagination,
  useTableApi,
} from '@/components';
import { IInutilizacaoFindAll } from '@/models';
import { pages, useRouter } from '@/routes';
import { inutilizacaoService } from '@/services';
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

import { INUTILIZACAO_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function InutilizacaoListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<IInutilizacaoFindAll>({ 
    modulo: 'inutilizacao' 
  });

  const { setValue, watch } = methods;

  const { dataTable, dense, linesPerPage, page, search, tab } = watch();

  const fetchData = () => {
    setValue('loading', true);

    const params = {
      page,
      linesPerPage,
    };

    inutilizacaoService
      .findAll({ params })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar inutilizações'))
      .finally(() => setValue('loading', false));
  };

  const handleView = (item: IInutilizacaoFindAll) => {
    router.push(pages.dashboard.contabil.fiscal.inutilizacao.view.path(item.id));
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search, tab]);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Inutilizações"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Inutilização',
              href: pages.dashboard.contabil.fiscal.inutilizacao.list.path,
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.contabil.fiscal.inutilizacao.create.path,
            label: 'Nova Inutilização',
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {INUTILIZACAO_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => {
                    return (
                      <TableRow hover key={item.id}>
                        <TableCell>{item.dataHora}</TableCell>

                        <TableCell align="center">{item.serie}</TableCell>

                        <TableCell align="center">{item.numeracao}</TableCell>

                        <TableCell>{item.justificativa}</TableCell>

                        <TableCell align="center">
                          <Label color={item?.autorizado ? 'success' : 'error'}>
                            {item?.autorizado ? 'Sim' : 'Não'}
                          </Label>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <TableActions
                            row={item}
                            viewer={{
                              onClick: () => handleView(item),
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>
      </RHFFormProvider>
    </Container>
  );
}
