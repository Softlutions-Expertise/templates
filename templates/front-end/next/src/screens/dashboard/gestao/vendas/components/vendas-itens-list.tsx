'use client';

import { TableBody, TableCell, TableHead, TableRow, Card, Table, TableContainer } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormContext } from 'react-hook-form';
import { Breadcrumbs, Scrollbar, TableEmptyRows, TableNoData } from '@/components';
import { IVendasViewer } from '@/models';
import {fNumber } from '@softlutions/utils';

import { VENDAS_ENUMS } from '../enums';

// ----------------------------------------------------------------------

export function VendasItensList() {
  const { watch } = useFormContext();
  const values: IVendasViewer = watch() as IVendasViewer;

  const itensArray = values?.itens || [];
  const emptyRows = itensArray.length > 0 ? 1 : 0;
  const notFound = itensArray.length === 0;

  return (
    <Grid xs={12}>
      <Breadcrumbs
        heading="Listagem dos Itens"
        sx={{
          my: 3,
        }}
      />
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 650 }} size={'small'}>
              <TableHead sx={{ height: 40 }}>
                <TableRow>
                  {VENDAS_ENUMS.TABLEHEADITENS.map((option) => (
                    <TableCell
                      key={option.id}
                      align={'left'}
                      style={{ width: `${option.width}px` }}
                    >
                      {option.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {itensArray?.map((row, index) => (
                  <TableRow hover key={`item-${index}`}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.item}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.mercadoriaDescricao}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                      {row.quantidade}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                      R${fNumber('money', row.valorUnitario)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                      R${fNumber('money', row.valorDesconto)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'left' }}>
                      {row.itemCancelado ? 'Sim' : 'Não'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableEmptyRows emptyRows={emptyRows} />
                <TableNoData notFound={notFound} endTitle="Itens" />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Grid>
  );
}
