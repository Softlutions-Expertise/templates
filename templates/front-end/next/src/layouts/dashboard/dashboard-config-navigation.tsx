import { Iconify, SvgColor } from '@/components';
import { useMemo } from 'react';

import { pages } from '@/routes';
import { useLocales } from '@/theme/locales';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const iconFy = (name: string) => (
  <Iconify icon={`solar:${name}-bold-duotone`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  fiscal: icon('ic_banking'),
  mercadorias: icon('ic_delivery'),
  movimentacao: iconFy('upload'),
  solicitacaoAjuste: icon('ic_notebook-bookmark'),
  combo: icon('ic_cart'),
  painelDigital: icon('ic_kanban'),

  ingresso: icon('ic_ticket'),
  suprimento: icon('ic_notebook-bookmark'),
  distribuidor: icon('ic_reel'),
  filme: icon('ic_clapperboard_open_play'),
  banner: icon('ic_kanban'),
  relatorio: icon('ic_file'),
  cliente: icon('ic_user'),
  fornecedor: icon('ic_delivery'),
  produto: icon('ic_order'),
  scb: icon('ic_videocamera'),
  vendas: icon('ic_bill'),
  sessao: icon('ic_calendar'),
  colaborador: icon('ic_job'),
  sala: icon('ic_kanban'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        subheader: t('contábil'),
        roles: pages.dashboard.contabil.fiscal.notaFiscal.list.roles,
        items: [
          {
            title: t('fiscal'),
            path: '#disabled',
            icon: ICONS.fiscal,
            roles: pages.dashboard.contabil.fiscal.notaFiscal.list.roles,
            children: [
              {
                title: t('notas fiscais'),
                path: pages.dashboard.contabil.fiscal.notaFiscal.list.path,
              },
              {
                title: t('parâmetros'),
                path: pages.dashboard.contabil.fiscal.parametro.edit.path,
              },
              {
                title: t('downloads'),
                path: pages.dashboard.contabil.fiscal.downloads.path,
              },
              {
                title: t('séries Nfe'),
                path: pages.dashboard.contabil.fiscal.serieNfe.list.path,
              },
              {
                title: t('regras tributárias'),
                path: pages.dashboard.contabil.fiscal.regraTributaria.list.path,
              },
              {
                title: t('inutilizações'),
                path: pages.dashboard.contabil.fiscal.inutilizacao.list.path,
              },
            ],
          },
        ],
      },
      {
        subheader: t('estoque'),
        roles: pages.dashboard.estoque.mercadoria.list.roles,
        items: [
          {
            title: t('mercadorias'),
            path: '#disabled',
            icon: ICONS.mercadorias,
            roles: pages.dashboard.estoque.mercadoria.list.roles,
            children: [
              {
                title: t('mercadorias'),
                path: pages.dashboard.estoque.mercadoria.list.path,
              },
              {
                title: t('Configurar Entrada'),
                path: pages.dashboard.estoque.mercadoria.configuracaoEntrada.list.path,
              },
            ],
          },
          {
            title: t('movimentações'),
            path: pages.dashboard.estoque.movimentacao.list.path,
            icon: ICONS.movimentacao,
            roles: pages.dashboard.estoque.movimentacao.list.roles,
          },
          {
            title: t('solicitações de ajuste'),
            path: pages.dashboard.estoque.solicitacaoAjuste.list.path,
            icon: ICONS.solicitacaoAjuste,
            roles: pages.dashboard.estoque.solicitacaoAjuste.list.roles,
          },
        ],
      },
      {
        subheader: t('estabelecimento'),
        roles: pages.dashboard.estabelecimento.relatorio.caixa.roles,
        items: [
          {
            title: t('relatórios'),
            path: '#disabled',
            icon: ICONS.relatorio,
            roles: pages.dashboard.estabelecimento.relatorio.caixa.roles,
            children: [
              { title: t('caixa'), path: pages.dashboard.estabelecimento.relatorio.caixa.path },
              { title: t('exibicao'), path: pages.dashboard.estabelecimento.relatorio.exibicao.path },
              { title: t('fiscal'), path: pages.dashboard.estabelecimento.relatorio.fiscal.path },
              {
                title: t('ingresso'),
                path: pages.dashboard.estabelecimento.relatorio.ingresso.path,
              },
              { title: t('produto'), path: pages.dashboard.estabelecimento.relatorio.produto.path },
              {
                title: t('rendas e borderô'),
                path: pages.dashboard.estabelecimento.relatorio.rendaBordero.path,
              },
              { title: t('venda'), path: pages.dashboard.estabelecimento.relatorio.venda.path },
              { title: t('estoque'), path: pages.dashboard.estabelecimento.relatorio.estoque.path },
            ],
          },
          {
            title: t('paineis digitais'),
            path: pages.dashboard.estabelecimento.painelDigital.list.path,
            icon: ICONS.painelDigital,
            roles: pages.dashboard.estabelecimento.painelDigital.list.roles,
          },
        ],
      },
      {
        subheader: t('exibições'),
        roles: pages.dashboard.exibicao.scb.bilheteria.list.roles,
        items: [
          {
            title: t('SCB'),
            path: '#disabled',
            icon: ICONS.scb,
            roles: pages.dashboard.exibicao.scb.bilheteria.list.roles,
            children: [
              {
                title: t('bilheterias'),
                path: pages.dashboard.exibicao.scb.bilheteria.list.path,
              },
              {
                title: t('lotes'),
                path: '#disabled',
              },
              {
                title: t('calendário'),
                path: pages.dashboard.exibicao.scb.calendario.list.path,
              },
            ],
          },
          {
            title: t('sessões'),
            path: pages.dashboard.exibicao.sessao.list.path,
            icon: ICONS.sessao,
            roles: pages.dashboard.exibicao.sessao.list.roles,
          },
          {
            title: t('filmes'),
            path: pages.dashboard.exibicao.filme.list.path,
            icon: ICONS.filme,
            roles: pages.dashboard.exibicao.filme.list.roles,
          },
          {
            title: t('sala'),
            path: pages.dashboard.exibicao.sala.list.path,
            icon: ICONS.sala,
            roles: pages.dashboard.exibicao.sala.list.roles,
          }
        ],
      },
      {
        subheader: t('Gestão'),
        items: [
          {
            title: t('Vendas'),
            path: pages.dashboard.gestao.vendas.list.path,
            icon: ICONS.vendas,
            roles: pages.dashboard.gestao.vendas.list.roles,
          },
          {
            title: t('Lançamentos'),
            path: pages.dashboard.gestao.lancamento.list.path,
            icon: ICONS.suprimento,
            roles: pages.dashboard.gestao.lancamento.list.roles,
          },
        ],
      },
      {
        subheader: t('Pessoas'),
        items: [
          {
            title: t('Colaboradores'),
            path: pages.dashboard.pessoa.colaborador.list.path,
            icon: ICONS.colaborador,
            roles: pages.dashboard.pessoa.colaborador.list.roles,
          },
        ],
      },
    ],
    [t],
  );

  return data;
}
