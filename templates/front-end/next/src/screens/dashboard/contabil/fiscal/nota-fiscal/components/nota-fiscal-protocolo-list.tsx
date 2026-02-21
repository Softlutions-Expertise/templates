'use client';

import { Breadcrumbs, Scrollbar, TableNoData } from '@/components';
import { INotaFiscalProtocolo } from '@/models';
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
import { useFormContext } from 'react-hook-form';

import { NOTA_FISCAL_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function NotaFiscalProtocoloList() {
  const { watch } = useFormContext();

  const values: INotaFiscalProtocolo = watch() as INotaFiscalProtocolo;

  const notFound = values.envios.length === 0;

  return (
    <Grid xs={12}>
      <Breadcrumbs
        heading="Listagem dos Envios"
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
                  {NOTA_FISCAL_ENUM.TABLE_HEADER_PROTOCOLO.map((item) => (
                    <TableCell key={item.label} {...(item as TableCellProps)}>
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {values.envios?.map((item) => (
                  <TableRow hover key={item?.protocoloDataHora}>
                    <TableCell sx={{ whiteSpace: 'nowrap', pl: 4.5 }}>{item.versao}</TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap', pl: 4.5 }}>{item.tentativa}</TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap', pl: 5 }}>{item.serieNota}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', pl: 6 }}>{item.numeroNota}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {item.chaveAcesso || '----------------------------------------------------'}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.status}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {item.protocolo || '---------------------'}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.protocoloDataHora}</TableCell>
                  </TableRow>
                ))}
                <TableNoData notFound={notFound} endTitle="Envios" />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Grid>
  );
}
