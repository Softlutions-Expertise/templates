'use client';

import { Breadcrumbs } from '@/components';
import { IMovimentacao } from '@/models';
import { pages, useParams, useRouter } from '@/routes';
import { movimentacaoService } from '@/services';
import { Button, Stack } from '@mui/material';
import { useError } from '@softlutions/hooks';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { MovimentacaoViewerInformacoes } from '../movimentacao-viewer-informacoes';
import { MovimentacaoViewerMercadoriaList } from '../movimentacao-viewer-mercadoria-list';

// ----------------------------------------------------------------------

export function MovimentacaoViewerView() {
  const handleError = useError();
  const router = useRouter();

  const { id } = useParams();

  const [currentData, setCurrentData] = useState<IMovimentacao>();

  useEffect(() => {
    movimentacaoService
      .findOneById(id as string)
      .then((response) => setCurrentData(response))
      .catch((error) => {
        handleError(error, 'Erro ao consultar movimentação');
        router.push(pages.dashboard.estoque.movimentacao.list.path);
      });
  }, []);

  const handleVerifyMovimentacao = async (type: 'back' | 'advance'): Promise<void> => {
    const newId = type === 'back' ? Number(id) - 1 : Number(id) + 1;

    await movimentacaoService.findOneById(newId).catch(() => {
      const message =
        type === 'back' ? 'Não há movimentação anterior' : 'Não há movimentação posterior';
      enqueueSnackbar(message, {
        variant: 'warning',
      });
    });
  };

  return (
    <>
      <Breadcrumbs
        heading="Visualização da Movimentação"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Movimentações', href: pages.dashboard.estoque.movimentacao.list.path },
          { name: currentData?.entidade?.id || currentData?.tipoMovimentacao.descricao },
        ]}
        actionRouter={{
          type: 'list',
          route: pages.dashboard.estoque.movimentacao.list.path,
          label: 'Listar Movimentações',
        }}
      />

      {currentData && <MovimentacaoViewerInformacoes currentData={currentData} />}
      {currentData && <MovimentacaoViewerMercadoriaList dataTable={currentData.itens} />}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }} spacing={2}>
        <Button
          type="button"
          variant="contained"
          color="inherit"
          onClick={() => handleVerifyMovimentacao('back')}
        >
          ({Number(id) - 1}) Anterior
        </Button>
        <Button
          type="button"
          variant="contained"
          color="inherit"
          onClick={() => handleVerifyMovimentacao('advance')}
        >
          Posterior ({Number(id) + 1})
        </Button>
      </Stack>
    </>
  );
}
