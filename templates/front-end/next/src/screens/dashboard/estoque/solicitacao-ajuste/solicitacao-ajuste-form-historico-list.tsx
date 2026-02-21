'use client';

import { Breadcrumbs, ILabelColor, Label, Scrollbar, TableNoData } from '@/components';
import { ISolicitacaoAjusteCreateUpdate } from '@/models';
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

import { SOLICITACAO_AJUSTE_ENUM } from './enums';

// ----------------------------------------------------------------------

export function SolicitacaoAjusteHistoricoList() {
  const { watch } = useFormContext();

  const values: ISolicitacaoAjusteCreateUpdate = watch() as ISolicitacaoAjusteCreateUpdate;

  return (
    <Grid xs={12} sx={{ mt: -2 }}>
      <Breadcrumbs heading="Historico de ajustes" />
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 650, mb: 2 }} size={'small'}>
              <TableHead>
                <TableRow>
                  {SOLICITACAO_AJUSTE_ENUM.TABLE_HEADER_HISTORICO.map((item) => (
                    <TableCell key={item.label} {...(item as TableCellProps)}>
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {values.historico
                  .filter((item) => !item.deletar)
                  ?.map((item) => (
                    <TableRow hover key={item?.id}>
                      <TableCell sx={{ pl: 3 }}>{item.numero}</TableCell>

                      <TableCell>{item.agenteNome || '- - - - - - - - -'}</TableCell>

                      <TableCell>{item.agenteEmail || '- - - - - - - - -'}</TableCell>

                      <TableCell>
                        {item.motivo.substring(0, 60)}
                        {item.motivo.length > 60 && '...'}
                      </TableCell>

                      <TableCell>
                        {
                          <Label
                            color={
                              SOLICITACAO_AJUSTE_ENUM.TABLE_TABS.find(
                                (option) => option.label === item.status.descricao,
                              )?.color as ILabelColor
                            }
                          >
                            {item.status.descricao}
                          </Label>
                        }
                      </TableCell>
                    </TableRow>
                  ))}

                <TableNoData notFound={values.historico.length === 0} colSpan={15} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Grid>
  );
}
