'use client';

import {
  Breadcrumbs,
  Container,
  Label,
  Scrollbar,
  TableActions,
  TableNoData,
  TablePagination,
  useTableApi,
} from '@/components';
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
  Stack,
  Tooltip,
} from '@mui/material';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect } from 'react';
import { TbWorldWww } from 'react-icons/tb';
import { CgDisplaySpacing } from 'react-icons/cg';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { enqueueSnackbar } from 'notistack';

import { SessaoFilters } from '../components';
import { SESSAO_ENUM } from '../enums';
import { sessaoService } from '@/services/dashboard/exibicao/sessao/sessao-service';

// ----------------------------------------------------------------------

export function SessaoListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<any, any>({ modulo: 'sessao' });

  const { setValue, watch, handleSubmit } = methods;

  const { currentRow, dataTable, dense, extra, linesPerPage, page, search } = watch();

  const fetchData = () => {
    setValue('loading', true);

    const params = {
      page,
      linesPerPage,
      dataInicial: extra?.dataInicial
        ? extra.dataInicial instanceof Date
          ? extra.dataInicial.toISOString().split('T')[0]
          : extra.dataInicial
        : undefined,
      dataFinal: extra?.dataFinal
        ? extra.dataFinal instanceof Date
          ? extra.dataFinal.toISOString().split('T')[0]
          : extra.dataFinal
        : undefined,
      sala: typeof extra?.sala === 'object' && extra.sala !== null
        ?
          (extra.sala.id ?? extra.sala.cod ?? extra.sala)
        : extra?.sala,
      filme: typeof extra?.filme === 'object' && extra.filme !== null
        ? (extra.filme.id ?? extra.filme.cod ?? extra.filme)
        : extra?.filme,
    };

    sessaoService
      .findAll({ params })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar sessões'))
      .finally(() => setValue('loading', false));
  };

  const handleEdit = (id: number) => router.push(pages.dashboard.exibicao.sessao.edit.path(id));

  const handleDelete = (id: number) => {
    sessaoService
      .remove(id)
      .then(() => {
        enqueueSnackbar('Sessão deletada com sucesso');
        fetchData();
      })
      .catch((error) => handleError(error, 'Erro ao deletar sessão'))
      .finally(() => setValue('confirm', false));
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
        <Breadcrumbs
          heading="Listagem de Sessões"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Sessão',
              href: pages.dashboard.exibicao.sessao.list.path,
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.exibicao.sessao.create.path,
            label: 'Nova Sessão',
          }}
        />

        <SessaoFilters fetchData={fetchData} />

        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {SESSAO_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => (
                    <TableRow hover key={item?.id}>
                      <TableCell>{item.id}</TableCell>

                      <TableCell>{`${item.data}  ${item.hora}` || '- - -'}</TableCell>

                      <TableCell>{item.sala || '- - -'}</TableCell>

                      <TableCell>{item.filme || '- - -'}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                          <Label>
                            {item.tipoProjecao.descricao || '- - -'}
                          </Label>
                          <Label>
                            {item.idiomaExibicao.descricao || '- - -'}
                          </Label>
                          {item.atmos && (
                            <Label>ATMOS</Label>
                          )}
                          {item.resolucao4k && (
                            <Label>4K</Label>
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Web">
                            <span>
                              <TbWorldWww 
                                size={20} 
                                color={item.venderWeb ? '#22c55e' : '#ef4444'} 
                              />
                            </span>
                          </Tooltip>
                          <Tooltip title="Autoatendimento">
                            <span>
                              <CgDisplaySpacing 
                                size={20} 
                                color={item.venderAtm ? '#22c55e' : '#ef4444'} 
                              />
                            </span>
                          </Tooltip>
                          <Tooltip title="PDV">
                            <span>
                              <LiaCashRegisterSolid 
                                size={20} 
                                color={item.venderPdv ? '#22c55e' : '#ef4444'} 
                              />
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{
                            onClick: () => handleEdit(item?.id),
                          }}
                          deleter={{
                            disabled: item.data.split('/').reverse().join('-') < new Date().toISOString().split('T')[0],
                            dialog: {
                              nameItem: 'id',
                              nameModel: 'Sessão',
                              onClick: () => handleDelete(currentRow.id),
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePagination />
        </Card>
      </RHFFormProvider>{' '}
    </Container>
  );
}
