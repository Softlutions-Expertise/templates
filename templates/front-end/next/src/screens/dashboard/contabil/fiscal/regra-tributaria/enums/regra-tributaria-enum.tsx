import { IconBadge } from '@/components';

// ----------------------------------------------------------------------

const FORM_TABS = [
  {
    value: 'informacoes',
    label: 'Informações da Regra Tributária',
    icon: <IconBadge>1</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'ID', sx: { width: '10%' } },
  { label: 'Descrição', sx: { width: '30%' } },
  { label: 'ICMS CST/CSOSN', sx: { width: '15%' }, align: 'center' },
  { label: 'PIS CST', sx: { width: '10%' }, align: 'center' },
  { label: 'COFINS CST', sx: { width: '10%' }, align: 'center' },
  { label: 'Código Benefício', sx: { width: '15%' }, align: 'center' },
  { label: 'Ações', sx: { width: '10%' } },
];

export const REGRA_TRIBUTARIA_ENUM = {
  FORM_TABS,
  TABLE_HEADER,
};
