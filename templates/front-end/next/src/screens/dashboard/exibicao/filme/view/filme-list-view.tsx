'use client';

import {  useEffect } from 'react';
import {
  Breadcrumbs,
  Container,
  Label,
  Scrollbar,
  TableNoData,
  TablePagination,
  useTableApi,
} from '@/components';
import { pages } from '@/routes';
import { filmeService } from '@/services';
import { RHFFormProvider } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { FilmeFilters } from '../components';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  type TableCellProps,
} from '@mui/material';
import { FILME_ENUM } from '../enums';
import { IFilme, IFilmeFilter } from '@/models';

// ----------------------------------------------------------------------

export default function FilmeListView() {
  const handleError = useError();

  const { methods } = useTableApi<IFilme, IFilmeFilter>({ modulo: 'filme' });
  const { setValue, watch, handleSubmit } = methods;
  const { dataTable, dense, extra, linesPerPage, page, search } = watch();

  const handleLabel = (cod: number): [string, string] => {
    switch (cod) {
      case 0:
        return ['#00a54f', 'L'];
      case 1:
        return ['#00aeef', '10'];
      case 2:
        return ['#fff101', '12'];
      case 3:
        return ['#f58220', '14'];
      case 4:
        return ['#ee1d23', '16'];
      case 5:
        return ['#080500', '18'];
      default:
        return ['#808080', 'N/A'];
    }
  };

  const fetchData = () => {
    setValue('loading', true);
    const params: any = {
      page,
      size: linesPerPage,
    };

    if (extra?.id) params.id = parseInt(extra.id);
    if (search) params.titulo = search;
    if (extra?.genero) params.genero = extra.genero;
    if (extra?.classificacaoIndicativa) params.classificacaoIndicativa = extra.classificacaoIndicativa;
    
    filmeService
      .index(params)
      .then((response) => setValue('response', response))
      .catch((error) => handleError(error, 'Erro ao consultar filmes'))
      .finally(() => setValue('loading', false));
  };

  useEffect(() => {
    fetchData();
  }, [linesPerPage, page, search]);

  return (
    <Container>
      <RHFFormProvider methods={methods} onSubmit={handleSubmit(fetchData)}>
        <Breadcrumbs
        heading="Listagem de Filmes"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Filmes', href: pages.dashboard.exibicao.filme.list.path },
          { name: 'Lista' },
        ]}
      />

        <FilmeFilters fetchData={fetchData} />

        <Card sx={{ p: 0 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    {FILME_ENUM.TABLE_HEADER.map((item) => (
                      <TableCell key={item.label} {...(item as TableCellProps)}>
                        {item.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dataTable?.map((row) => {
                    const classificacao = row.classificacaoIndicativa
                      ? handleLabel(row.classificacaoIndicativa.cod)
                      : ['#808080', 'N/A'];

                    return (
                      <TableRow hover key={row.id}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.id}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.titulo}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {row.generoPrincipal?.descricao || '---'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Label sx={{ color: 'white', bgcolor: classificacao[0] }}>
                            {classificacao[1]}
                          </Label>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {row.dataEstreia || '---'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {row.dataPreEstreia || '---'}
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
      </RHFFormProvider>
    </Container>
  );
}
