import { IconBadge } from '@/components';

// ----------------------------------------------------------------------

const FORM_TABS = [
  {
    value: 'informacoesGerais',
    label: 'Informações Gerais',
    icon: <IconBadge>1</IconBadge>,
  },
  {
    value: 'componente',
    label: 'Componentes',
    icon: <IconBadge>2</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Nome', sx: { width: '30%' } },
  { label: 'Grupo', sx: { width: '8%' } },
  { label: 'Unidade Medida', sx: { width: '15%' }, align: 'center' },
  { label: 'Ativo', sx: { width: '12%' }, align: 'center' },
  { label: 'Saldo Atual', sx: { width: '10%' }, align: 'center' },
  { label: 'Saldo Mínimo Web', sx: { width: 1 }, align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

export const COMPONENTES_TABLE_HEADERS = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Mercadoria', sx: { width: '30%' } },
  { label: 'Tipo', sx: { width: '12%' } },
  { label: 'Quantidade', sx: { width: '12%' }, align: 'center' },
  { label: 'valorUnitario', sx: { width: '12%' }, align: 'center' },
  { label: 'Valor Total', sx: { width: '12%' }, align: 'center' },
  { label: 'Ativo', sx: { width: 1 }, align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_TABS = [
  {
    value: 'all',
    label: 'Todos',
  },
  {
    label: 'Salgados',
  },
  {
    label: 'Doces',
  },
  {
    label: 'Bebidas',
  },
  {
    label: 'Itens Personalizados',
  },
  {
    label: 'Brindes',
  },
];

export const MERCADORIA_ENUM = {
  FORM_TABS,
  TABLE_HEADER,
  TABLE_TABS,
};
