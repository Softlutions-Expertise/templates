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
  useTableLocal,
} from '@/components';
import { ISerieFindAll } from '@/models';
import { pages, useRouter } from '@/routes';
import { serieService } from '@/services';
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

import { SERIE_NFE_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function SerieNfeListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods, localFilteringPaging } = useTableLocal<ISerieFindAll>({ modulo: 'serie-nfe' });

  const { setValue, watch } = methods;

  const { dense, dataTableFilter, linesPerPage, page, search, tab } = watch();

  const fetchData = () => localFilteringPaging('ativo');

  const handleEdit = (item: ISerieFindAll) => {
    router.push(
      pages.dashboard.contabil.fiscal.serieNfe.edit.path(item.ambiente.cod, item.modelo.cod, item.serie),
    );
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search, tab]);

  useEffect(() => {
    serieService
      .findAll()
      .then((response) => setValue('dataTable', response))
      .catch((error) => handleError(error, 'Erro ao consultar séries de NFe'));
  }, []);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Séries"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Séries de Nfe',
              href: pages.dashboard.contabil.fiscal.serieNfe.list.path,
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.contabil.fiscal.serieNfe.create.path,
            label: 'Nova Série de NFe',
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {SERIE_NFE_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTableFilter?.map((item) => {
                    return (
                      <TableRow hover key={item.id}>
                        <TableCell>{item.ambiente.descricao}</TableCell>

                        <TableCell>{item.modelo.descricao}</TableCell>

                        <TableCell align="center">{item.serie}</TableCell>

                        <TableCell align="center">{item.numeracao}</TableCell>

                        <TableCell align="center">
                          <Label color={item?.padrao ? 'success' : 'error'}>
                            {item?.padrao ? 'sim' : 'não'}
                          </Label>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <TableActions
                            row={item}
                            edit={{
                              onClick: () => handleEdit(item),
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
