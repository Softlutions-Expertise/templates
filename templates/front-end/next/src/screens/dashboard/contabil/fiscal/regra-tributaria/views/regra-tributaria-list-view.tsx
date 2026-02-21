'use client';

import {
  Breadcrumbs,
  Container,
  Scrollbar,
  TableActions,
  TableFilter,
  TableNoData,
  TablePagination,
  useTableLocal,
} from '@/components';
import { IRegraTributariaFindAll } from '@/models';
import { pages, useRouter } from '@/routes';
import { regraTributariaService } from '@/services';
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

import { REGRA_TRIBUTARIA_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function RegraTributariaListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods, localFilteringPaging } = useTableLocal<IRegraTributariaFindAll>({ modulo: 'regra-tributaria' });

  const { setValue, watch } = methods;

  const { dense, dataTableFilter, linesPerPage, page, search, tab } = watch();

  const fetchData = () => localFilteringPaging('ativo');

  const handleEdit = (item: IRegraTributariaFindAll) => {
    router.push(pages.dashboard.contabil.fiscal.regraTributaria.edit.path(item.id));
  };

  const handleView = (item: IRegraTributariaFindAll) => {
    router.push(pages.dashboard.contabil.fiscal.regraTributaria.view.path(item.id));
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search, tab]);

  useEffect(() => {
    regraTributariaService
      .findAll()
      .then((response: IRegraTributariaFindAll[]) => setValue('dataTable', response))
      .catch((error: any) => handleError(error, 'Erro ao consultar regras tributárias'));
  }, []);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Regras Tributárias"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Regras Tributárias',
              href: pages.dashboard.contabil.fiscal.regraTributaria.list.path,
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.contabil.fiscal.regraTributaria.create.path,
            label: 'Nova Regra Tributária',
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {REGRA_TRIBUTARIA_ENUM.TABLE_HEADER.map((item) => (
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
                        <TableCell align="center">{item.id}</TableCell>

                        <TableCell>{item.descricao}</TableCell>

                        <TableCell align="center">{item.icmsCstCsosn}</TableCell>

                        <TableCell align="center">{item.pisCst}</TableCell>

                        <TableCell align="center">{item.cofinsCst}</TableCell>

                        <TableCell align="center">{item.codigoBeneficioFiscal}</TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <TableActions
                            row={item}
                            edit={{
                              onClick: () => handleEdit(item),
                            }}
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
