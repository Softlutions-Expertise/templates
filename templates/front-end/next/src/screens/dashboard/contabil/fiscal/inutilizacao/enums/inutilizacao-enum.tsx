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
  { label: 'Data/Hora', sx: { width: '15%' } },
  { label: 'Série', sx: { width: '10%' }, align: 'center' },
  { label: 'Numeração', sx: { width: '15%' }, align: 'center' },
  { label: 'Justificativa', sx: { width: '40%' } },
  { label: 'Autorizado', sx: { width: '10%' }, align: 'center' },
  { label: 'Ações', sx: { width: '10%' } },
];

export const INUTILIZACAO_ENUM = {
  FORM_TABS,
  TABLE_HEADER,
};
