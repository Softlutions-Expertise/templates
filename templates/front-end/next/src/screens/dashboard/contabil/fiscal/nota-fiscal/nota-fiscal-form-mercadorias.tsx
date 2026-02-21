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
import { IFiscalContext, IFiscalMercadoria } from '@/models';
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

import { NotaFiscalDialogMercadoriaCreateEditForm } from './components';
import { NOTA_FISCAL_ENUM } from './enums';

// ----------------------------------------------------------------------

interface Props {
  context: IFiscalContext;
}

export function NotaFiscalFormMercadorias({ context }: Props) {
  const { getValues, setValue } = useFormContext();

  const { methods, localFilteringPaging } = useTableLocal<IFiscalMercadoria>({ tab: true });
  const { setValue: setValueList, watch: watchList } = methods;
  const { currentRow, dense, dataTable, dataTableFilter, linesPerPage, page, search } = watchList();

  const fetchData = () => localFilteringPaging();

  const handleDelete = useCallback(
    (id: any) => {
      const index = dataTable.findIndex((item) => item.id === id);
      const newDataTable = [...dataTable];
      newDataTable[index].deletar = true;

      setValueList('dataTable', [...dataTable]);
      setValueList('confirm', false);
    },
    [dataTable?.length, dataTable],
  );

  const handleEdit = (row: IFiscalMercadoria) =>
    setValueList('currentRow', { ...row, renderForm: true });

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  useEffectSkipFirst(() => {
    setValue('itens', dataTable);
  }, [dataTable]);

  useEffect(() => {
    const itensAtuais = getValues('itens') || [];
    if (itensAtuais.length > 0) {
      setValueList('dataTable', itensAtuais);
    }
  }, []);

  return (
    <Grid xs={12}>
      <RHFFormProvider methods={methods}>
        <NotaFiscalDialogMercadoriaCreateEditForm context={context} />

        <Breadcrumbs
          heading="Listagem de Mercadorias"
          actionRouter={{
            type: 'create',
            onClick: () => setValueList('currentRow', { renderForm: true }),
            label: 'Adicionar mercadoria',
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {NOTA_FISCAL_ENUM.TABLE_HEADER_MERCADORIA.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTableFilter
                    .filter((item) => !item.deletar)
                    ?.map((item) => (
                      <TableRow hover key={item?.id}>
                        <TableCell>{item?.id}</TableCell>
                        <TableCell>{item?.descricao}</TableCell>

                        <TableCell>
                          {
                            context.unidadeMedida?.find(
                              (option) =>
                                option.cod ===
                                (item?.unidadeMedida?.cod || (item?.unidadeMedida as any)),
                            )?.descricao
                          }
                        </TableCell>

                        <TableCell>{item?.ncm}</TableCell>

                        <TableCell>{item?.cest || '-------'}</TableCell>

                        <TableCell>{item?.icmsCstCsosn || '-------'}</TableCell>

                        <TableCell>{item?.pisCst}</TableCell>

                        <TableCell>{item?.cofinsCst}</TableCell>

                        <TableCell>{item?.quantidade}</TableCell>

                        <TableCell>R${fNumber('money', item?.valorUnitario)}</TableCell>

                        <TableCell>R${fNumber('money', item?.valorDesconto)}</TableCell>

                        <TableCell>R${fNumber('money', item?.valorTotal)}</TableCell>

                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <TableActions
                            row={item}
                            edit={{
                              onClick: () => handleEdit(item),
                            }}
                            deleter={{
                              dialog: {
                                nameItem: 'descricao',
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
                    endTitle="Mercadorias"
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
