'use client';

import {
  Breadcrumbs,
  Container,
  ILabelColor,
  Label,
  TableActions,
  TableNoData,
  TablePagination,
  useTableLocal,
} from '@/components';
import {  RHFFormProvider, RHFSwitch,} from '@softlutions/components';
import { useBoolean, useEffectSkipFirst, useError } from '@softlutions/hooks';
import { ICaixaFindOne, ICaixaLancamento, ILancamentoFindAllFilter } from '@/models';
import { caixaService, lancamentoService } from '@/services';
import { fNumber, getLocalItem, setLocalItem } from '@softlutions/utils';
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
import { useEffect, useState } from 'react';
import { LancamentoDialogCreateEdit, LancamentoTableConsolidacao } from '../components';
import { LancamentoTableFilter } from '../components/lancamento-table-filter';
import { LANCAMENTO_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function LancamentoListView() {
  const handleError = useError();
  const dialogLancamento = useBoolean();

  const user = getLocalItem('user');

  const { STATUS, TABLE_HEADER } = LANCAMENTO_ENUM;

  const [caixa, setCaixa] = useState<ICaixaFindOne>({} as ICaixaFindOne);

  const { methods, localFilteringPaging } = useTableLocal<ICaixaLancamento, ILancamentoFindAllFilter>({ extra: { dataInicial: new Date().toISOString()}});

  const { setValue, watch } = methods;
  const { currentRow, dataTableFilter, dense, extra, linesPerPage, page } = watch();

  const fetchData = () => {
    setValue('loading', true);

    caixaService.findOneById(Number(extra?.caixa))
      .then((response) => {
        setValue('dataTable', response.lancamentos || []);
        setCaixa(response);
      })
      .catch((error) => handleError(error, 'Serviço de Caixa indisponível'))
      .finally(() => setValue('loading', false));
  };

  const handleEdit = (id: number | string) => {
    lancamentoService.findOneById(Number(id))
      .then((response) => {
        setValue('currentRow', { ...response, id, dataInicial: extra?.dataInicial });
        dialogLancamento.onTrue();
      })
      .catch((error) => handleError(error, 'Serviço de Lançamento indisponível'));
  };

  useEffectSkipFirst(() => {
    localFilteringPaging();
  }, [linesPerPage, page]);

  useEffect(() => {
    setLocalItem('lancamento.consolidacao', extra?.consolidacao);
  }, [extra?.consolidacao]);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <LancamentoDialogCreateEdit
          open={dialogLancamento.value}
          onClose={() => {
            setValue('currentRow', null);
            dialogLancamento.onFalse();
            fetchData();
          }}
          currentData={currentRow}
        />

        <Breadcrumbs
          heading="Listagem de Lançamentos"
          actionRouter={{
            type: 'create',
            label: 'Novo Lançamento',
            onClick: () => dialogLancamento.onTrue(),
          }}
        />
        <LancamentoTableFilter fetchData={fetchData} />
        <RHFSwitch name="extra.consolidacao" label="Exibir Consolidação" sx={{ mt: -2, mb: 1 }} />
        {extra.consolidacao && <LancamentoTableConsolidacao caixa={caixa} />}
        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.neutral' }}>
                  {TABLE_HEADER.map((item) => (
                    <TableCell key={item.label} {...(item as TableCellProps)}>
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTableFilter?.map((item) => (
                  <TableRow hover key={item?.id}>
                    <TableCell>{item?.id}</TableCell>

                    <TableCell align="center">{item?.venda || '----'}</TableCell>

                    <TableCell>{item?.dataHoraLancamento}</TableCell>

                    <TableCell align="center">
                      <Label variant="soft" color={STATUS[item?.status?.descricao] as ILabelColor}>
                        {item?.status?.descricao}
                      </Label>
                    </TableCell>

                    <TableCell align="center">{item?.formaPagamento?.descricao}</TableCell>
                    <TableCell align="center">
                      {item?.subFormaPagamento?.descricao || '-------'}
                    </TableCell>

                    <TableCell align="center">{item?.tipoMovimento?.descricao}</TableCell>

                    <TableCell>
                      {item?.valor >= 0 ? `R$${fNumber('money', item?.valor)}` : '---------'}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <TableActions
                        row={item}
                        edit={{
                          onClick: () => handleEdit(item?.id),
                          roles: ['gerente', 'supervisor', 'admin', 'contabilidade'],
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                <TableNoData />
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination />
        </Card>
      </RHFFormProvider>
    </Container>
  );
}
