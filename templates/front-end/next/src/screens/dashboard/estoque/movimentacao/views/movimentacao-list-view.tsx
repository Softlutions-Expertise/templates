'use client';

import {
  Breadcrumbs,
  ConfirmDialog,
  Iconify,
  ILabelColor,
  Label,
  Scrollbar,
  TableActions,
  TableNoData,
  TablePagination,
  TableTabs,
  useTableApi,
} from '@/components';
import { IMovimentacaoFindAll, IMovimentacaoFilter } from '@/models';
import { pages, useRouter } from '@/routes';
import { movimentacaoService } from '@/services';
import { LoadingButton } from '@mui/lab';
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
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { MovimentacaoFilters } from '../components';
import { MOVIMENTACAO_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function MovimentacaoListView() {
  const router = useRouter();
  const handleError = useError();
  const { enqueueSnackbar } = useSnackbar();

  const { methods } = useTableApi<IMovimentacaoFindAll, IMovimentacaoFilter>({
    modulo: 'movimentacao',
  });

  const { setValue, watch, handleSubmit } = methods;

  const { dense, dataTable, linesPerPage, page, tab, extra } = watch();

  const [openConfirmReverter, setOpenConfirmReverter] = useState(false);
  const [selectedMovimentacao, setSelectedMovimentacao] = useState<IMovimentacaoFindAll | null>(null);
  const [loadingReverter, setLoadingReverter] = useState(false);

  const fetchData = () => {
    setValue('loading', true);

    const params = {
      page,
      linesPerPage,
    };

    const payload: IMovimentacaoFilter = {
      ...extra,
      fornecedor:
        typeof extra?.fornecedor === 'object'
          ? (extra.fornecedor as { id: number })?.id
          : extra?.fornecedor,
      mercadoria:
        typeof extra?.mercadoria === 'object'
          ? (extra.mercadoria as { id: number })?.id
          : extra?.mercadoria,
    };

    movimentacaoService
      .findAll({ params, payload })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar movimentações'))
      .finally(() => setValue('loading', false));
  };

  const handleViewer = (id: number) => router.push(pages.dashboard.estoque.movimentacao.viewer.path(id));

  const handleOpenReverter = (movimentacao: IMovimentacaoFindAll) => {
    setSelectedMovimentacao(movimentacao);
    setOpenConfirmReverter(true);
  };

  const handleReverter = () => {
    if (!selectedMovimentacao) return;

    setLoadingReverter(true);
    movimentacaoService
      .reverter(selectedMovimentacao.id)
      .then(() => {
        enqueueSnackbar('Movimentação revertida com sucesso!', { variant: 'success' });
        setOpenConfirmReverter(false);
        setSelectedMovimentacao(null);
        fetchData();
      })
      .catch((error) => handleError(error, 'Erro ao reverter movimentação'))
      .finally(() => setLoadingReverter(false));
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, tab]);

  return (
    <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
      <Breadcrumbs
        heading="Listagem de Movimentação"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Movimentação', href: pages.dashboard.estoque.movimentacao.list.path },
          { name: 'Lista' },
        ]}
      />

      <MovimentacaoFilters fetchData={fetchData} />

      <Card>
        <TableTabs options={MOVIMENTACAO_ENUM.TABLE_TABS} searchKey="tipoMovimentacao.descricao" />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  {MOVIMENTACAO_ENUM.TABLE_HEADER.map((item) => (
                    <TableCell key={item.label} {...(item as TableCellProps)}>
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable?.map((item) => {
                  return (
                    <TableRow hover key={item?.id}>
                      <TableCell>{item?.id}</TableCell>

                      <TableCell align="center">
                        <Label
                          color={
                            MOVIMENTACAO_ENUM.TABLE_TABS.find(
                              (option) => option.label === item?.tipoMovimentacao?.descricao,
                            )?.color as ILabelColor
                          }
                        >
                          {item?.tipoMovimentacao?.descricao}
                        </Label>
                      </TableCell>

                      <TableCell align="center">{item?.naturezaMovimentacao?.descricao}</TableCell>

                      <TableCell>{item.nome}</TableCell>

                      <TableCell align="center">
                        <Label color={item?.status === 'EFETIVADA' ? 'success' : 'error'}>
                          {item?.status || '-'}
                        </Label>
                      </TableCell>

                      <TableCell align="center">{item?.documentoReferencia || '-'}</TableCell>

                      <TableCell align="center">{item?.quantidadeItens}</TableCell>

                      <TableCell align="center">{item?.dataHoraMovimento}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          startOtherActions={[
                            {
                              tooltip: 'Reverter Movimentação',
                              icon: <Iconify icon="solar:undo-left-round-bold" />,
                              color: 'warning.main',
                              onClick: () => handleOpenReverter(item),
                            },
                          ]}
                          viewer={{
                            onClick: () => handleViewer(item.id),
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

      <ConfirmDialog
        open={openConfirmReverter}
        onClose={() => {
          setOpenConfirmReverter(false);
          setSelectedMovimentacao(null);
        }}
        title="Reverter Movimentação"
        content="Esta ação irá desfazer essa movimentação. Ela não irá excluir a Nota Fiscal de entrada. Quer desfazer esta movimentação?"
        action={
          <LoadingButton
            variant="contained"
            color="warning"
            onClick={handleReverter}
            loading={loadingReverter}
          >
            Sim, reverter
          </LoadingButton>
        }
      />
    </RHFFormProvider>
  );
}
