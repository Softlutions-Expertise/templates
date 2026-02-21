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
  TableTabs,
  useTableApi,
} from '@/components';
import { IMercadoriaFindAll } from '@/models';
import { pages, useRouter } from '@/routes';
import { mercadoriaService } from '@/services';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  type TableCellProps,
} from '@mui/material';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect } from 'react';

import { MERCADORIA_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function MercadoriaListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<IMercadoriaFindAll>({ modulo: 'mercadoria' });

  const { setValue, watch } = methods;

  const { dense, dataTable, linesPerPage, page, search, tab } = watch();

  const fetchData = () => {
    mercadoriaService
      .findAll({ linesPerPage, page, search })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar mercadorias'));
  };

  const handleEdit = (id: number) => router.push(pages.dashboard.estoque.mercadoria.edit.path(id));

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search, tab]);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Mercadorias"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            { name: 'Mercadorias', href: pages.dashboard.estoque.mercadoria.list.path },
            { name: 'Lista' },
          ]}
        />
        <Card>
          <TableTabs options={MERCADORIA_ENUM.TABLE_TABS} searchKey="grupoMercadoria.descricao" />

          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {MERCADORIA_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item?.label} {...(item as TableCellProps)}>
                        {item?.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => (
                    <TableRow hover key={item?.id}>
                      <TableCell>{item?.id}</TableCell>

                      <TableCell>{item?.descricao}</TableCell>

                      <TableCell>{item?.grupoMercadoria?.descricao}</TableCell>

                      <TableCell align="center">
                        {item?.unidadeMedida?.descricao || '- - - - - - -'}
                      </TableCell>

                      <TableCell align="center">
                        <Label color={item?.ativo ? 'success' : 'error'}>
                          {item?.ativo ? 'sim' : 'não'}
                        </Label>
                      </TableCell>

                      <TableCell align="center">{item?.saldoAtual}</TableCell>

                      <TableCell align="center">{item?.saldoMinimo}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{
                            onClick: () => handleEdit(item?.id),
                          }}
                          deleter={{
                            disabled: true,
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
      </RHFFormProvider>
    </Container>
  );
}
