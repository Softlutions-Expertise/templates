'use client';

import { Breadcrumbs, Iconify, ILabelColor, Label, Scrollbar, TableEmptyRows, TableNoData, useSettingsContext } from '@/components';
import { ICaixa, ICliente, IVendasContext, IVendasFilter, IVendasItem } from '@/models';
import { pages, useRouter } from '@/routes';
import { CaixaService, ClienteService, VendasService } from '@/services';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Container, Stack } from '@mui/system';
import { RHFAutocomplete, RHFDatePicker, RHFFormProvider, RHFSelect, RHFTextField, } from '@softlutions/components';
import { useEffectSkipFirst, useError } from '@softlutions/hooks';
import { fDate, fNumber, getLocalItem, setLocalItem, setSessionItem } from '@softlutions/utils';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';


import { VENDAS_ENUMS } from '../enums';

// ----------------------------------------------------------------------

export function VendasListView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const handleErrors = useError();

  const [dataTable, setDataTable] = useState<IVendasItem[]>([]);
  const [dense, setDense] = useState(true);
  const [page, setPage] = useState(1);
  const [quantPagsApi, setQuantPagsApi] = useState(1);
  const [linesPerPage, setlinesPerPage] = useState(25);
  const [totalItemsApi, setTotalItemsApi] = useState(0);
  const [loader, setLoader] = useState(false);
  const [listaClientes, setListaClientes] = useState<any[]>([]);
  const [listaCaixas, setListaCaixas] = useState<any[]>([]);

  const ITEMS_PER_PAGE_OPTIONS = [25, 50, 100];
  const canReset = !isEqual('', '');
  const notFound = (!dataTable.length && canReset) || !dataTable.length;

  const [vendasContext, setVendasContext] = useState<IVendasContext>({} as IVendasContext);

  const defaultValues = useMemo(
    (): IVendasFilter => ({
      dataInicio: getLocalItem('vendas.dataInicio') || new Date(),
      dataFim: getLocalItem('vendas.dataFim') || new Date(),
      origem: getLocalItem('vendas.origem') || '',
      localizador: getLocalItem('vendas.localizador') || '',
      total: getLocalItem('vendas.total') || 0,
      cliente: null,
      caixa: null,
      status: getLocalItem('vendas.status') || '',
      direction: 'DESC',
    }),
    [],
  );

  const methods = useForm<IVendasFilter>({
    defaultValues,
  });

  const { watch, setValue } = methods;

  const values = watch();

  const emptyRows = () => {
    if (totalItemsApi <= linesPerPage) {
      return 0;
    }

    const rowCount = Math.max(totalItemsApi, 0);
    return linesPerPage - Math.min(linesPerPage, rowCount - (page - 1) * linesPerPage);
  };

  const handleDense = (event: any) => {
    setDense(event.target.checked);
  };

  const handlelinesPerPageChange = (event: any) => {
    setlinesPerPage(event.target.value);
  };

  const handleViewerRow = useCallback(
    (row: IVendasItem) => {
      setSessionItem('id', row.id);
      router.push(pages.dashboard.gestao.vendas.viewer.path);
    },
    [router],
  );

  const handleStatus = (status: { cod: number; descricao: string }) => {
    let color: ILabelColor = 'default';
    switch (status.descricao) {
      case 'Aguardando pagamento':
        color = 'warning';
        break;
      case 'Aprovada':
        color = 'success';
        break;
      case 'Cancelada':
        color = 'error';
        break;
      case 'Devolvida':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    return <Label color={color}>{status.descricao}</Label>;
  };

  const handleClearFilters = () => {
    Object.keys(values).forEach((key) => {
      if (key === 'total') {
        setValue(key as keyof typeof values, 0);
      } else if (key === 'cliente' || key === 'caixa') {
        setValue(key as keyof typeof values, null as any);
      } else {
        setValue(key as keyof typeof values, '');
      }
    });
  };

  const handleClienteInput = async (_event: any, value: string) => {
    if (!value || value.length < 2) {
      return;
    }

    try {
      const clientes = await ClienteService.filter(value);
      setListaClientes(clientes || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchData = async () => {
    setLoader(true);
    const data = {
      params: { 
        page: page,
        linesPerPage,
        direction: values.direction,
      },
      data: {
        cliente: values.cliente?.id || undefined,
        localizador: values.localizador || undefined,
        caixa: values.caixa?.id || undefined,
        origem: values.origem ? Number(values.origem) : undefined,
        status: values.status ? Number(values.status) : undefined,
        total: values.total || undefined,
        dataInicio: values.dataInicio ? fDate("yyyy-MM-dd", values.dataInicio) : undefined,
        dataFim: values.dataFim ? fDate("yyyy-MM-dd", values.dataFim) : undefined,
      },
    };

    VendasService.index(data)
      .then((response) => {
        setDataTable(response.content);
        setQuantPagsApi(response.page.totalPages);
        setTotalItemsApi(response.page.totalElements);
      })
      .catch((error) => handleErrors(error, 'Erro ao buscar vendas'))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    setPage(1);
    fetchData();
  }, [linesPerPage]);

  useEffectSkipFirst(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    Object.keys(values).forEach((key) => {
      setLocalItem(`vendas.${key}`, values?.[key as keyof typeof values]);
    });
  }, [values]);

  useEffect(() => {
    VendasService.context().then((response) => {
      setVendasContext(response);
    });

    ClienteService.filter('').then((clientes) => {
      setListaClientes(clientes || []);
    }).catch((error) => {
      console.error('Erro ao carregar clientes:', error);
    });

    fetchData();
  }, []);

  useEffect(() => {
    if (values.dataInicio && values.dataFim) {
      const dataInicial = fDate('yyyy-MM-dd', values.dataInicio);
      const dataFinal = fDate('yyyy-MM-dd', values.dataFim);
      CaixaService.menu(dataInicial, dataFinal)
        .then((caixas) => {
          setListaCaixas(caixas || []);
        })
        .catch((error) => {
          console.error('Erro ao carregar caixas:', error);
          setListaCaixas([]);
        });
    }
  }, [values.dataInicio, values.dataFim]);

  useEffect(() => {
    if (!values.cliente) {
      ClienteService.filter('').then((clientes) => {
        setListaClientes(clientes || []);
      }).catch((error) => {
        console.error('Erro ao carregar clientes:', error);
      });
    }
  }, [values.cliente]);

  return (
    <RHFFormProvider methods={methods}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Breadcrumbs
          heading="Listagem de Vendas"
          links={[
            {
              name: 'Painel',
              href: pages.dashboard.root.path,
            },
            {
              name: 'Vendas',
              href: pages.dashboard.gestao.vendas.list.path,
            },
            { name: 'Lista' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card sx={{ mb: 3, p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
                <RHFDatePicker name="dataInicio" label="Data Inicial" size="small" />
                <RHFDatePicker name="dataFim" label="Data Final" size="small" />                
                <RHFAutocomplete
                  fullWidth
                  name="cliente"
                  label="Cliente"
                  size="small"
                  options={listaClientes}
                  getOptionLabel={(option: any) => {
                    if (!option) return '';
                    return `${option.id} - ${option.nome}`;
                  }}
                  isOptionEqualToValue={(opt: any, val: any) => opt.id === val.id}
                  onInputChange={handleClienteInput}
                  noOptionsText="Digite para buscar clientes"
                  value={watch('cliente') || null}
                  filterOptions={(x: any) => x}
                />
                <RHFAutocomplete
                  fullWidth
                  name="caixa"
                  label="Caixa"
                  size="small"
                  options={listaCaixas || []}
                  getOptionLabel={(option: any) => {
                    if (!option) return '';
                    return option.descricao;
                  }}
                  isOptionEqualToValue={(opt: any, val: any) => opt.id === val.id}
                  noOptionsText="Selecione as datas para carregar as caixas"
                  value={watch('caixa') || null}
                />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center">
                <RHFTextField name="localizador" label="Localizador" size="small" />
                <RHFSelect name="origem" label="Origem" size="small">
                  {vendasContext?.origem?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect name="status" label="Status" size="small">
                  {vendasContext?.status?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField name="total" label="Valor total" size="small" mask='money' />
              </Stack>
            </Grid>
            <Grid xs={8} />
            <Grid xs={4}>
              <Stack alignItems="flex-end" direction={{ sx: 'column', md: 'row' }} spacing={2}>
                <Button fullWidth variant="outlined" onClick={() => handleClearFilters()}>
                  Limpar filtros
                </Button>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={loader}
                  onClick={() => {
                    setPage(1);
                    fetchData();
                  }}
                  fullWidth
                >
                  Pesquisar
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Card>
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {VENDAS_ENUMS.TABLEHEADER.map((option) => (
                      <TableCell
                        key={option?.id}
                        align={'left'}
                        style={{ width: `${option?.width}px` }}
                      >
                        {option?.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.id}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.cliente || '-'}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.dataHora}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.localizador}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {handleStatus(row.status)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', pl: 3.25 }}>
                        {row.valorTotal}
                      </TableCell>
                      <TableCell sx={{ px: 1, whiteSpace: 'nowrap', pl: 2.5 }}>
                        <IconButton
                          color="default"
                          onClick={() => {
                            handleViewerRow(row);
                          }}
                        >
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableEmptyRows emptyRows={emptyRows()} />
                  <TableNoData
                    notFound={notFound}
                    title="Não há registros de Vendas"
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '15px',
              fontSize: '0.875rem',
            }}
          >
            <FormControlLabel
              value="comprimir"
              control={<Switch color="primary" checked={dense} onChange={handleDense} />}
              label="Comprimir tabela"
            />

            <Pagination count={quantPagsApi} onChange={(_, value) => setPage(value)} />

            <Box>
              <span> Itens por página: </span>
              <Select
                style={{ marginLeft: '10px', width: '65px', height: '35px' }}
                value={linesPerPage}
                onChange={handlelinesPerPageChange}
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Card>
      </Container>
    </RHFFormProvider>
  );
}
