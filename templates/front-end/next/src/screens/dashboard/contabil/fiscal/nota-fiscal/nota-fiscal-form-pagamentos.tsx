'use client';

import {
  Breadcrumbs,
  Scrollbar,
  TableActions,
  TableFilter,
  TableNoData,
  TablePagination,
  useTableLocal,
} from '@/components';
import { IFiscalContext, IFiscalPagamentos } from '@/models';
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
import { fDate, fNumber } from '@softlutions/utils';
import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { NotaFiscalDialogPagamentosCreateEditForm } from './components';
import { NOTA_FISCAL_ENUM } from './enums';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function NotaFiscalFormPagamentos({ context }: Props) {
  const { getValues, setValue } = useFormContext();

  const { methods, localFilteringPaging } = useTableLocal<IFiscalPagamentos>({
    tab: true,
  });
  const { setValue: setValueList, watch: watchList } = methods;
  const { currentRow, dense, dataTable, dataTableFilter, linesPerPage, page, search } = watchList();

  const fetchData = () => localFilteringPaging();

  const handleDelete = useCallback(
    (id: any) => {
      const index = dataTable.findIndex((item) => item?.id === id);
      const newDataTable = [...dataTable];
      newDataTable[index].deletar = true;

      setValueList('dataTable', [...dataTable]);
      setValueList('confirm', false);
    },
    [dataTable?.length, dataTable],
  );

  const handleEdit = (row: IFiscalPagamentos) =>
    setValueList('currentRow', { ...row, renderForm: true });

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  useEffectSkipFirst(() => {
    setValue('pagamentos', dataTable);
  }, [dataTable]);

  useEffect(() => {
    setValueList('dataTable', getValues('pagamentos') || []);
  }, []);

  return (
    <Grid xs={12}>
      <RHFFormProvider methods={methods}>
        <NotaFiscalDialogPagamentosCreateEditForm context={context} />

        <Breadcrumbs
          heading="Listagem de Pagamentos"
          actionRouter={{
            type: 'create',
            onClick: () => setValueList('currentRow', { renderForm: true }),
            label: 'Adicionar pagamento',
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {NOTA_FISCAL_ENUM.TABLE_HEADER_PAGAMENTOS.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTableFilter
                    .filter((item) => !item.deletar)
                    ?.map((item, index) => (
                      <TableRow hover key={item?.id || index + 1}>
                        <TableCell>{item?.id || index}</TableCell>
                        <TableCell>
                          {
                            context.formaPagamento?.find(
                              (option) =>
                                option.cod ===
                                Number(item?.formaPagamento?.cod || (item?.formaPagamento as any)),
                            )?.descricao
                          }
                        </TableCell>

                        <TableCell>
                          {
                            context.tipoPagamento?.find(
                              (option) =>
                                option.cod ===
                                Number(item?.tipoPagamento?.cod || (item?.tipoPagamento as any)),
                            )?.descricao
                          }
                        </TableCell>

                        <TableCell>R${fNumber('money', item?.valorPagamento)}</TableCell>
                        <TableCell>{fDate('dd/MM/yyyy', item?.dataPagamento)}</TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <TableActions
                            row={item}
                            edit={{
                              onClick: () => handleEdit(item),
                            }}
                            deleter={{
                              dialog: {
                                nameItem: 'valorPagamento',
                                nameModel: 'nota fiscal',
                                onClick: () => handleDelete(currentRow?.id),
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                  <TableNoData
                    colSpan={15}
                    endTitle="Pagamentos"
                    notFound={dataTableFilter?.filter((item) => !item.deletar).length === 0}
                  />
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
