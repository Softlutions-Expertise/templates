'use client';

import {
  Breadcrumbs,
  Container,
  Iconify,
  Scrollbar,
  TableActions,
  TableNoData,
  useTableApi,
} from '@/components';
import { ISalaFindAll } from '@/models';
import { pages, useRouter } from '@/routes';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useEffect } from 'react';

import { SALA_ENUM } from '../enums';
import { salaService } from '@/services';

// ----------------------------------------------------------------------

export function SalaListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<ISalaFindAll>({ modulo: 'sala' });

  const { setValue, watch, handleSubmit } = methods;

  const { dataTable, dense } = watch();

  const fetchData = () => {
    setValue('loading', true);

    salaService
      .findAll()
      .then((response) => setValue('dataTable', response))
      .catch((error) => handleError(error, 'Erro ao consultar salas'))
      .finally(() => setValue('loading', false));
  };

  const handleEdit = (id: number) => router.push(pages.dashboard.exibicao.sala.edit.path(id));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
        <Breadcrumbs
          heading="Listagem de Salas"
          links={[
            { name: 'Painel', href: pages.dashboard.root.path },
            {
              name: 'Sala',
              href: pages.dashboard.exibicao.sala.list.path,
            },
            { name: 'Lista' },
          ]}
          actionRouter={{
            type: 'create',
            route: pages.dashboard.exibicao.sala.create.path,
            label: 'Nova Sala',
          }}
        />

        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {SALA_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} sx={item.sx} align={item.align as 'left' | 'center' | 'right'}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable?.map((item: ISalaFindAll) => (
                    <TableRow hover key={item?.id}>
                      <TableCell sx={{ width: '5%' }}>{item.id}</TableCell>

                      <TableCell sx={{ width: '30%' }}>{item.descricao || '- - -'}</TableCell>

                      <TableCell sx={{ width: '20%' }}>{item.registroAncine || '- - -'}</TableCell>

                      <TableCell sx={{ width: '15%' }} align="center">{item.dimensoes || '- - -'}</TableCell>

                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <TableActions
                          row={item}
                          edit={{
                            onClick: () => handleEdit(item?.id),
                          }}
                          endOtherActions={[
                            {
                              tooltip: 'Mapa de Poltronas',
                              icon: <Iconify icon="ic:outline-event-seat" />,
                              onClick: () => router.push(pages.dashboard.exibicao.sala.mapaPoltronas.path(item?.id)),
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableNoData />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </RHFFormProvider>
    </Container>
  );
}
