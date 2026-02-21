'use client';

import {
  Breadcrumbs,
  Container,
  ILabelColor,
  Label,
  Scrollbar,
  TableActions,
  TableFilter,
  TableNoData,
  TablePagination,
  TableTabs,
  useTableApi,
} from '@/components';
import { ISolicitacaoAjusteFindAll } from '@/models';
import { pages, useRouter } from '@/routes';
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
import { useEffect } from 'react';

import { solicitacaoAjusteService } from '@/services/dashboard/estoque';

import { SolicitacaoAjusteDialogActionCancel } from '../components';
import { SOLICITACAO_AJUSTE_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function SolicitacaoAjusteListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<ISolicitacaoAjusteFindAll>({ modulo: 'solicitacao-ajuste' });

  const { setValue, watch } = methods;

  const { dense, dataTable, linesPerPage, page, search, tab } = watch();

  const fetchData = () => {
    solicitacaoAjusteService
      .findAll({ linesPerPage, page, search })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar unidades'));
  };

  const handleEdit = (id: number) =>
    router.push(pages.dashboard.estoque.solicitacaoAjuste.edit.path(id));

  const handleDelete = (item: ISolicitacaoAjusteFindAll) => {
    setValue('currentRow', item);
    setValue('confirm', true);
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search, tab]);

  return (
    <Container>
      <RHFFormProvider methods={methods}>
        <Breadcrumbs
          heading="Listagem de Solicitações de Ajuste"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Solicitações de ajuste',
              href: pages.dashboard.estoque.solicitacaoAjuste.list.path
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.estoque.solicitacaoAjuste.create.path,
            label: 'Nova Solicitação de Ajuste',
          }}
        />
        <Card>
          <TableTabs options={SOLICITACAO_AJUSTE_ENUM.TABLE_TABS} searchKey="status.descricao" />

          <TableFilter />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {SOLICITACAO_AJUSTE_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.id}</TableCell>

                      <TableCell>
                        <Label
                          color={
                            SOLICITACAO_AJUSTE_ENUM.TABLE_TABS.find(
                              (option) => option.label === item?.status?.descricao,
                            )?.color as ILabelColor
                          }
                        >
                          {item.status.descricao}
                        </Label>
                      </TableCell>

                      <TableCell align="center">{item.quantidadeItens}</TableCell>

                      <TableCell>{item.dataHoraStatus}</TableCell>

                      <TableCell>{item.dataHoraRequisicao}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{
                            onClick: () => handleEdit(item?.id),
                          }}
                          deleter={{
                            tooltip: 'Cancelar',
                            onClick: () => handleDelete(item),
                            disabled: item.status.cod !== 0,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <SolicitacaoAjusteDialogActionCancel />

                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>
      </RHFFormProvider>
    </Container>
  );
}
