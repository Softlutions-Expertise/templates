'use client';

import {
  Breadcrumbs,
  ConfirmDialog,
  Container,
  Iconify,
  Label,
  Scrollbar,
  TableActions,
  TableNoData,
  TablePagination,
  useTableApi,
} from '@/components';
import { IBilheteriaFindAll, IBilheteriaFindAllFilter } from '@/models';
import { pages, useRouter } from '@/routes';
import { bilheteriaService } from '@/services';
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
import { useBoolean, useError } from '@softlutions/hooks';
import { fDate } from '@softlutions/utils';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import { BilheteriaFilters } from '../components/bilheteria-filters';
import { BILHETERIA_ENUM } from '../enums';

// ----------------------------------------------------------------------

export function BilheteriaListView() {
  const router = useRouter();
  const handleError = useError();
  const dialogRetificar = useBoolean();

  const { methods } = useTableApi<IBilheteriaFindAll, IBilheteriaFindAllFilter>({ modulo: 'bilheteria' });
  const { setValue, watch, handleSubmit } = methods;

  const { dataTable, dense, extra, linesPerPage, page, search } = watch();

  const currentRow = watch('currentRow');

  const fetchData = () => {
    setValue('loading', true);

    const params = {
      page,
      linesPerPage,
    };

    const payload: IBilheteriaFindAllFilter = {
      ...extra,
      ...(extra?.dataCinematografica instanceof Date &&
        !isNaN(extra.dataCinematografica.getTime()) && {
          dataCinematografica: fDate('yyyy-MM-dd', extra.dataCinematografica),
        }),
    };

    bilheteriaService
      .findAll({ params, payload })
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar bilheterias'))
      .finally(() => setValue('loading', false));
  };

  const handleDelete = (id: number) => {
    bilheteriaService
      .remove(id)
      .then(() => {
        enqueueSnackbar('Bilheteria deletada com sucesso');
        fetchData();
      })
      .catch((error) => handleError(error, 'Erro ao deletar bilheteria'))
      .finally(() => setValue('confirm', false));
  };

  const handleViewer = (id: number) =>
    router.push(pages.dashboard.exibicao.scb.bilheteria.viewer.path(id));

  const handleRetificar = (id: number) => {
    setValue('loading', true);

    bilheteriaService
      .retificar(id)
      .then(() => {
        enqueueSnackbar('Bilheteria retificada com sucesso');
        fetchData();
      })
      .catch((error) => {
        const msg = error?.response?.data?.message || 'Erro ao retificar bilheteria';
        handleError(error, msg);
      })
      .finally(() => {
        setValue('loading', false);
        dialogRetificar.onFalse();
      });
  };

  const handleEnviar = (id: number) => {
    setValue('loading', true);
    bilheteriaService
      .enviar(id)
      .then(() => {
        enqueueSnackbar('Bilheteria enviada com sucesso');
        fetchData();
      })
      .catch((error) => {
        const msg = error?.response?.data?.message || 'Erro ao enviar bilheteria';
        handleError(error, msg);
      })
      .finally(() => setValue('loading', false));
  };

  const handleConsultar = async (id: number) => {
    setValue('loading', true);

    try {
      const updatedData: IBilheteriaFindAll = await bilheteriaService.consultar(id);
      enqueueSnackbar('Consulta realizada com sucesso');

      const currentTable = watch('dataTable') || [];

      const updatedTable = currentTable.map((row: IBilheteriaFindAll) =>
        row.id === updatedData.id
          ? {
              ...row,
              ...updatedData,
            }
          : row,
      );

      setValue('dataTable', updatedTable);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Erro ao consultar bilheteria';
      handleError(error, msg);
    } finally {
      setValue('loading', false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
        <Breadcrumbs
          heading="Listagem de Bilheterias"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            { name: 'Bilheterias', href: pages.dashboard.contabil.fiscal.notaFiscal.list.path },
            { name: 'Lista' },
          ]}
        />

        <BilheteriaFilters fetchData={fetchData} />

        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {BILHETERIA_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item) => (
                    <TableRow hover key={item?.id}>
                      <TableCell>{item.sala || '- - - - - -'}</TableCell>

                      <TableCell>{item.dataCinematografica || '- - - - - -'}</TableCell>

                      <TableCell>{item.dataHoraEnvio}</TableCell>

                      <TableCell align="center">
                        <Label color={item?.houveSessoes ? 'success' : 'error'}>
                          {item?.houveSessoes ? 'sim' : 'não'}
                        </Label>
                      </TableCell>

                      <TableCell align="center">
                        <Label color={item?.retificadora ? 'warning' : 'success'}>
                          {item?.retificadora ? 'sim' : 'não'}
                        </Label>
                      </TableCell>

                      <TableCell align="center">
                        <Label color={item?.retificada ? 'warning' : 'success'}>
                          {item?.retificada ? 'sim' : 'não'}
                        </Label>
                      </TableCell>

                      <TableCell>{item.status?.descricao || '-----------'}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          startOtherActions={[
                            {
                              tooltip: 'Retificar',
                              icon: <Iconify icon="solar:refresh-bold" />,
                              onClick: () => {
                                setValue('currentRow', item);
                                dialogRetificar.onTrue();
                              },
                              roles: ['!suporte'],
                            },
                            {
                              tooltip: 'Enviar',
                              icon: <Iconify icon="solar:upload-bold" />,
                              disabled: item.enviada === true,
                              onClick: () => {
                                setValue('currentRow', item);
                                handleEnviar(item.id);
                              },
                              roles: ['!suporte'],
                            },
                            {
                              tooltip: 'Consultar',
                              icon: <Iconify icon="solar:calendar-search-bold" />,
                              disabled: item.status?.cod !== 2,
                              onClick: () => {
                                setValue('currentRow', item);
                                handleConsultar(item.id);
                              },
                            },
                          ]}
                          viewer={{
                            onClick: () => handleViewer(item.id),
                          }}
                          deleter={{
                            disabled: item.enviada === true,
                            roles: ['!suporte'],
                            dialog: {
                              nameItem: 'id',
                              nameModel: 'Bilheteria',
                              content: 'Essa é uma ação irreversível. Deseja continuar?',
                              textConfirm: 'Sim, deletar',
                              onClick: () => {
                                setValue('currentRow', item);
                                handleDelete(item.id);
                              },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <ConfirmDialog
                    open={dialogRetificar.value}
                    onClose={dialogRetificar.onFalse}
                    title="Retificar"
                    content="Retificar esta bilheteria irá invalidar a anterior. Deseja continuar?"
                    action={
                      <LoadingButton
                        variant="contained"
                        color="warning"
                        onClick={() => handleRetificar(currentRow?.id)}
                        loading={watch('loading')}
                      >
                        Sim, retificar
                      </LoadingButton>
                    }
                  />
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
