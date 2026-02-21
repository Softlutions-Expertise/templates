import { TRelatorioTypeForm } from "@/models";

// ----------------------------------------------------------------------

const NOME: Record<TRelatorioTypeForm, string> = {
  caixa: 'Caixa',
  exibicao: 'Exibição',
  fiscal: 'Fiscal',
  estoque: 'Estoque',
  venda: 'Venda',
  ingresso: 'Ingresso',
  produto: 'Produto',
  rendaBordero: 'Rendas e Bordero',
  exemplo: 'Exemplo',
};


const RELATORIOS = {
  caixa: [
    {
      rota: '/reports/caixa/movimentacao',
      descricao: 'Movimentação por Período',
    },
    {
      rota: '/income/relatorios/data-tipo-resumido',
      descricao: 'Vendas por tipo',
    },
    {
      rota: '/reports/cartao/movimentacao',
      descricao: 'Detalhamento de cartões',
    },
  ],
  exibicao: [
    {
      rota: '/reports/exibicao/tempoorigem',
      descricao: 'Tempo de Exibição por País de Origem',
    },
  ],
  fiscal: [
    {
      rota: '/fiscal/reports/mapa-fiscal-item',
      descricao: 'Mapa Fiscal por Produtos',
    },
    {
      rota: '/fiscal/reports/mapa-fiscal-data-emissao',
      descricao: 'Mapa Fiscal por Data de Emissão',
    },
    {
      rota: '/fiscal/reports/mapa-fiscal-data-venda',
      descricao: 'Mapa Fiscal por Data da Venda',
    },
  ],
  ingresso: [
    {
      rota: '/reports/ingresso/filme',
      descricao: 'Ingressos por Filme',
      versaoApi: 2,
      rotaV2: '/income/relatorios/ingressos-filme-detalhado',
    },
    {
      rota: '/reports/ingresso/sessao',
      descricao: 'Ingressos por Sessões',
      versaoApi: 2,
      rotaV2: '/income/relatorios/ingressos-sessao-detalhado',
    },
    {
      rota: '/reports/ingresso/data',
      descricao: 'Ingressos por Data',
      versaoApi: 2,
      rotaV2: '/income/relatorios/ingressos-data-detalhado',
    },
    {
      rota: '/reports/ingresso/data/origem',
      descricao: 'Ingressos por Data Origem',
      versaoApi: 2,
      rotaV2: '/income/relatorios/ingressos-data-origem-detalhado',
    },
    {
      rota: '/reports/ingresso/data/shopping',
      descricao: 'Ingressos por Data Shopping',
      versaoApi: 2,
      rotaV2: '/income/relatorios/ingressos-data-detalhado-shopping',
    },
    {
      rota: '/reports/ingresso/resumido',
      descricao: 'Venda Geral de Ingressos',
      versaoApi: 2,
      rotaV2: '/income/relatorios/ingressos-resumido',
    },
  ],
  produto: [
    {
      rota: '/reports/produto/data/origem',
      descricao: 'Venda de Produtos Bomboniere',
      versaoApi: 2,
      rotaV2: '/income/relatorios/mercadoria-data-origem',
    },
    {
      rota: '/reports/produto/venda-mercadoria-resumido',
      descricao: 'Listagem dos Produtos Vendidos',
      versaoApi: 2,
      rotaV2: '/income/relatorios/venda-mercadoria-resumido',
    },
    {
      rota: '/income/relatorios/venda-combos-resumido',
      descricao: 'Venda de Combos',
      versaoApi: 2,
    },
    {
      rota: '/income/relatorios/venda-mercadoria-proximas-sessoes',
      descricao: 'Itens vendidos para as próximas sessões',
      versaoApi: 2,
      bloquearData: true,
    },
  ],
  rendaBordero: [
    {
      rota: '/bordero/ecad/detalhado',
      descricao: 'Rendas Enviadas por Data',
      versaoApi: 2,
      rotaV2: '/bordero/ecad/v2/detalhado',
    },
  ],
  venda: [
    {
      id: 'caixa-dataorigem',
      rota: (tipo: string) => `/reports/caixa/${tipo}/dataorigem`,
      descricao: 'Vendas por Data e Origem',
      versaoApi: 2,
      rotaV2: '/income/relatorios/data-venda-resumido',
    },
  ],
  estoque: [
    {
      rota: '/warehouse/relatorios/estoque-ativo',
      descricao: 'Estoque Atual (Somente Produtos Ativos)',
    },
    {
      rota: '/warehouse/relatorios/estoque-atual',
      descricao: 'Estoque Atual (Todos os Produtos)',
    },
  ],
};

const TIPO = [
  {
    id: 'vendas',
    nome: 'Vendas',
  },
  {
    id: 'sessoes',
    nome: 'Sessões',
    disabled: true,
  },
];

export const RELATORIO_ENUMS = {
  RELATORIOS,
  NOME,
  TIPO,
};
