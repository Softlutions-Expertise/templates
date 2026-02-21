'use client';

import {
  Breadcrumbs,
  Scrollbar,
  TableFilter,
  TableNoData,
  useTableLocal,
} from '@/components';
import { IMovimentacaoMercadoria } from '@/models';
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
import {
  RHFFormProvider,
} from '@softlutions/components';
import { useEffect } from 'react';

import { MOVIMENTACAO_ENUM } from './enums';

// ----------------------------------------------------------------------

interface Props {
  dataTable: IMovimentacaoMercadoria[];
}

export function MovimentacaoViewerMercadoriaList({ dataTable }: Props) {
  const { methods, localFilteringPaging } = useTableLocal<IMovimentacaoMercadoria>({
    tab: true,
  });
  const { setValue, watch } = methods;
  const { dense, dataTableFilter, linesPerPage, page, search } = watch();

  const fetchData = () => localFilteringPaging();

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  useEffect(() => {
    setValue('dataTable', dataTable);
  }, []);

  return (
    <Grid xs={12}>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem das Mercadorias"
          sx={{
            mt: 5,
            mb: 3,
          }}
        />
        <Card>
          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650, mb: 2 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {MOVIMENTACAO_ENUM.TABLE_HEADER_MERCADORIA.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTableFilter?.map((item: IMovimentacaoMercadoria) => (
                    <TableRow hover key={item.mercadoriaId}>
                      <TableCell>{item.mercadoriaId}</TableCell>

                      <TableCell>{item.mercadoriaDescricao}</TableCell>

                      <TableCell align="center">{item.quantidade}</TableCell>

                      <TableCell align="center">{item.saldoAnterior}</TableCell>

                      <TableCell align="center">{item.saldoPosterior}</TableCell>
                    </TableRow>
                  ))}
                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </RHFFormProvider>
    </Grid>
  );
}
