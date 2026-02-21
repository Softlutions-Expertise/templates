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
import { IEstoqueContext, ISolicitacaoAjusteItemItens } from '@/models';
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
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { SOLICITACAO_AJUSTE_ENUM } from '../enums';
import { SolicitacaoAjusteDialogMercadoriaCreateEditForm } from './solicitacao-ajuste-dialog-mercadoria-create-edit-form';

// ----------------------------------------------------------------------

interface Props {
  context: IEstoqueContext;
}
export function SolicitacaoAjusteMercadoriaList({ context }: Props) {
  const { getValues, setValue, watch } = useFormContext();

  const { disabledForm } = watch();

  const { methods, localFilteringPaging } = useTableLocal<ISolicitacaoAjusteItemItens>({
    dataTable: getValues('itens'),
  });

  const { setValue: setValueList, watch: watchList } = methods;

  const { currentRow, dense, dataTable, dataTableFilter, linesPerPage, page, search } = watchList();

  const fetchData = () => localFilteringPaging();

  const handleEdit = (row: ISolicitacaoAjusteItemItens) =>
    setValueList('currentRow', { ...row, renderForm: true });

  const handleDelete = (id: number) => {
    const index = dataTable.findIndex((item) => item.id === id);
    const newDataTable = [...dataTable];
    newDataTable[index].deletar = true;

    setValueList('dataTable', [...dataTable]);
    setValueList('confirm', false);
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  useEffectSkipFirst(() => {
    setValue('itens', dataTable);
  }, [dataTable]);

  return (
    <RHFFormProvider methods={methods}>
      <Grid xs={12} sx={{ mt: -2 }}>
        <SolicitacaoAjusteDialogMercadoriaCreateEditForm context={context} />

        <Breadcrumbs
          heading="Listagem das Mercadorias"
          actionRouter={{
            type: 'create',
            onClick: () => setValueList('currentRow', { renderForm: true }),
            label: 'Adicionar Mercadoria',
            disabled: disabledForm,
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {SOLICITACAO_AJUSTE_ENUM.TABLE_HEADER_MERCADORIA.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTableFilter
                    .filter((item) => !item.deletar)
                    ?.map((item) => {
                      const operacao = context?.operacaoAjusteManual?.find(
                        (option) => option?.cod?.toString() === item?.operacao?.toString(),
                      )?.descricao;

                      return (
                        <TableRow hover>
                          <TableCell>{item.id}</TableCell>

                          <TableCell>{item.descricao}</TableCell>

                          <TableCell>
                            {item.motivo.substring(0, 60)}
                            {item.motivo.length > 60 && '...'}
                          </TableCell>

                          <TableCell align="center">{item.saldoCalcular}</TableCell>

                          <TableCell align="center">
                            <Label
                              color={
                                (operacao?.toLowerCase() === 'adicionar' && 'success') || 'error'
                              }
                            >
                              {operacao}
                            </Label>
                          </TableCell>

                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <TableActions
                              row={item}
                              edit={{
                                onClick: () => handleEdit(item),
                                disabled: disabledForm,
                              }}
                              deleter={{
                                disabled: disabledForm,
                                dialog: {
                                  nameItem: 'descricao',
                                  nameModel: 'Mercadorias',
                                  onClick: () => handleDelete(currentRow?.id),
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  <TableNoData colSpan={15} endTitle="Mercadorias" />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>
      </Grid>
    </RHFFormProvider>
  );
}
