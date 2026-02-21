'use client';

import {
  Breadcrumbs,
  Label,
  Scrollbar,
  TableActions,
  TableFilter,
  TableNoData,
  TablePagination,
  useTableLocal,
} from '@/components';
import { IMercadoriaComponenteListagem } from '@/models';
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
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useEffectSkipFirst } from '@softlutions/hooks';
import { fNumber } from '@softlutions/utils';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { MercadoriaDialogComponenteCreateEditForm } from './components/mercadoria-dialog-componente-create-edit-form';
import { COMPONENTES_TABLE_HEADERS } from './enums';

interface Props {
  context?: any;
}

export function MercadoriaFormComponente({ context }: Props) {
  const { getValues, setValue } = useFormContext();

  const { methods, localFilteringPaging } = useTableLocal<IMercadoriaComponenteListagem>({
    tab: true,
  });
  const { setValue: setValueList, watch: watchList } = methods;
  const { dense, dataTable, dataTableFilter, linesPerPage, page, search } = watchList();
  const fetchData = () => localFilteringPaging();
  const handleDelete = useCallback(
    (id: any) => {
      const newDataTable = dataTable.filter((item) => item.id !== id);

      setValueList('dataTable', [...newDataTable]);
      setValueList('confirm', false);
    },
    [dataTable],
  );

  const handleEdit = (row: IMercadoriaComponenteListagem) =>
    setValueList('currentRow', { ...row, renderForm: true });

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  useEffectSkipFirst(() => {
    setValue('componentes', dataTable);
  }, [dataTable]);

  useEffect(() => {
    const componentes = getValues('componentes');
    if (componentes && componentes.length > 0) {
      setValueList('dataTable', componentes);
    }
  }, []);

  useEffect(() => {
    const componentes = getValues('componentes');
    if (componentes && componentes.length > 0 && dataTable.length === 0) {
      setValueList('dataTable', componentes);
    }
  }, [getValues('componentes')]);

  return (
    <Grid xs={12}>
      <RHFFormProvider methods={methods}>
        <MercadoriaDialogComponenteCreateEditForm context={context} />

        <Breadcrumbs
          heading="Listagem de Componentes"
          actionRouter={{
            type: 'create',
            onClick: () => setValueList('currentRow', { renderForm: true }),
            label: 'Adicionar componente',
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {COMPONENTES_TABLE_HEADERS.map((item) => (
                      <TableCell key={item?.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTableFilter.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.searchMercadoria.descricao}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell align="center">{item.quantidade}</TableCell>
                      <TableCell align="center">
                        R$ {fNumber('money', item?.valorUnitario) || '-----'}
                      </TableCell>
                      <TableCell align="center">
                        R$ {fNumber('money', item?.valorTotalItem) || '-----'}
                      </TableCell>
                      <TableCell align="center">
                        <Label color={item?.ativo ? 'success' : 'error'}>
                          {item?.ativo ? 'sim' : 'não'}
                        </Label>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{ onClick: () => handleEdit(item) }}
                          deleter={{
                            dialog: {
                              nameItem: 'id',
                              nameModel: 'componente',
                              onClick: () => handleDelete(item.id),
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableNoData endTitle="Componentes" />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>
      </RHFFormProvider>
    </Grid>
  );
}
