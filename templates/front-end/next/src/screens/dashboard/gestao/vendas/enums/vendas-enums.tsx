import { IconBadge } from '@/components';
import { IVendasFinalizeForm } from '@/models';

// ----------------------------------------------------------------------

const DEFAULTFINALIZEFORM: IVendasFinalizeForm = {
  type: 'default',
  load: false,
};

const TABLEHEADER = [
    { id: 'codigo', label: 'Código', width: 25 },
    { id: 'cliente', label: 'Cliente', width: 80 },
    { id: 'dataHora', label: 'Data Hora', width: 50 },
    { id: 'localizador', label: 'Localizador', width: 100 },
    { id: 'status', label: 'Status', width: 100 },
    { id: 'valorTotal', label: 'Valor Total', width: 100 },
    { id: 'acoes', label: 'Ações', width: 50 },
];

const TABLEHEADINGRESSO = [
  { id: 'tipoIngresso', label: 'Tipo do Ingresso', width: 100 },
  { id: 'tipoPoltrona', label: 'Tipo da Poltrona', width: 100 },
  { id: 'quantidade', label: 'Quantidade', width: 100 },
  { id: 'valorUnitario', label: 'Valor Unitário', width: 100 },
  { id: 'totalItem', label: 'Valor Total', width: 100 },
];

const TABLEHEADPAGAMENTO = [
  { id: 'tentativa', label: 'Tentativa', width: 50 },
  { id: 'venda', label: 'Venda', width: 100 },
  { id: 'idTransacao', label: 'Código', width: 100 },
  { id: 'operadora', label: 'Operação', width: 100 },
  { id: 'nomeCartao', label: 'Nome Cartão', width: 100 },
  { id: 'numeroCartao', label: 'Número Cartão', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'subStatus', label: 'Sub Status', width: 100 },
  { id: 'comentario', label: 'Comentário', width: 100 },
];

const TABLEHEADPRODUTO = [
  { id: 'produto', label: 'Produto', width: 180 },
  { id: 'quantidade', label: 'Quantidade', width: 100 },
  { id: 'valorUnitario', label: 'Valor Unitário', width: 100 },
  { id: 'totalItem', label: 'Valor Total', width: 100 },
];

const TABLEHEADITENS = [
  { id: 'item', label: 'Item', width: 80 },
  { id: 'descricao', label: 'Descrição', width: 200 },
  { id: 'quantidade', label: 'Quantidade', width: 100 },
  { id: 'valorUnitario', label: 'Valor Unitário', width: 120 },
  { id: 'valorDesconto', label: 'Valor Desconto', width: 140 },
  { id: 'itemCancelado', label: 'Cancelado', width: 100 },
];

const TABS = [
  {
    value: 'venda',
    label: 'Venda',
    icon: <IconBadge>1</IconBadge>,
  },
  {
    value: 'itens',
    label: 'Itens',
    icon: <IconBadge>2</IconBadge>,
  },
  {
    value: 'pagamento',
    label: 'Pagamento',
    icon: <IconBadge>3</IconBadge>,
  },
];
export const VENDAS_ENUMS = {
  DEFAULTFINALIZEFORM,
  TABLEHEADER,
  TABLEHEADINGRESSO,
  TABLEHEADPAGAMENTO,
  TABLEHEADPRODUTO,
  TABLEHEADITENS,
  TABS,
};
