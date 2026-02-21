import { IconBadge } from '@/components';

// ----------------------------------------------------------------------

const FORM_TABS = [
  {
    value: 'informacoes',
    label: 'Informações',
    icon: <IconBadge>1</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Nome', sx: { width: '25%' } },
  { label: 'IP', sx: { width: '20%' } },
  { label: 'Tipo Painel', sx: { width: '25%' } },
  { label: 'Ativo', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_TABS = [
  { value: 'all', label: 'Todos' },
  { value: true, label: 'Ativo', color: 'success' },
  { value: false, label: 'Inativo', color: 'error' },
];

export const PAINEL_DIGITAL_ENUMS = {
  FORM_TABS,
  TABLE_HEADER,
  TABLE_TABS,
};
