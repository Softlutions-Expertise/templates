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
  useTableLocal,
} from '@/components';
import { IPainelDigitalFindAll } from '@/models';
import { painelDigitalService } from '@/services';
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
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';

import { pages, useRouter } from '@/routes/';

import { PAINEL_DIGITAL_ENUMS } from '../enums';

// ----------------------------------------------------------------------

export function PainelDigitalListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods, localFilteringPaging } = useTableLocal<IPainelDigitalFindAll>({ modulo: 'painel-digital' });
  const { setValue, watch } = methods;
  const { currentRow, dense, dataTable, dataTableFilter, linesPerPage, page, search, tab } =
    watch();

  const fetchData = () => localFilteringPaging('ativo');

  const handleEdit = useCallback(
    (id: number) => {
      router.push(pages.dashboard.estabelecimento.painelDigital.edit.path(id));
    },
    [router],
  );

  const handleDelete = useCallback(
    (id: number) => {
      painelDigitalService.remove(id).then(() => {
        const deleteRow = dataTable.filter((item: IPainelDigitalFindAll) => item.id !== id);
        setValue('dataTable', deleteRow);
        enqueueSnackbar('Deletado com sucesso!');
      });
    },
    [dataTable?.length, dataTable],
  );

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, tab, search]);

  useEffect(() => {
    painelDigitalService
      .findAll()
      .then((response) => setValue('dataTable', response))
      .catch((error) => handleError(error, 'Erro ao consultar paineis digitais'));
  }, []);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Paineis Digitais"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            { name: 'Paineis Digitais ', href: pages.dashboard.estabelecimento.painelDigital.list.path },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            label: 'Novo Painel Digital',
            route: pages.dashboard.estabelecimento.painelDigital.create.path,
            roles: ['!suporte'],
          }}
        />
        <Card>
          <TableTabs options={PAINEL_DIGITAL_ENUMS.TABLE_TABS} searchKey="ativo" />

          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {PAINEL_DIGITAL_ENUMS.TABLE_HEADER.map((item) => (
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
                        <TableCell>{item.id}</TableCell>

                        <TableCell>{item.nome}</TableCell>
                        <TableCell>{item.ip || '-----------'}</TableCell>
                        <TableCell>{item.tipoPainel}</TableCell>
                        <TableCell>
                          <Label color={item.ativo ? 'success' : 'error'}>
                            {item.ativo ? 'sim' : 'não'}
                          </Label>
                        </TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <TableActions
                            row={item}
                            edit={{
                              onClick: () => handleEdit(item.id),
                              roles: ['!suporte'],
                            }}
                            deleter={{
                              roles: ['!suporte'],
                              dialog: {
                                nameItem: 'nome',
                                nameModel: 'Painel Digital',
                                onClick: () => handleDelete(currentRow?.id),
                              },
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
