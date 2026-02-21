import { IconBadge } from '@/components';

// ----------------------------------------------------------------------

const FORM_TABS = [
  {
    value: 'informacoesGerais',
    label: 'Informações Gerais',
    icon: <IconBadge>1</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'ID', align: 'left' },
  { label: 'ConfiguracaoEntrada', align: 'left' },
  { label: 'Mercadoria', align: 'left' },
  { label: 'Código Barras', align: 'center' },
  { label: 'Código Produto', align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

export const CONFIGURACAO_ENTRADA_ENUM = {
  TABLE_HEADER,
  FORM_TABS,
};
