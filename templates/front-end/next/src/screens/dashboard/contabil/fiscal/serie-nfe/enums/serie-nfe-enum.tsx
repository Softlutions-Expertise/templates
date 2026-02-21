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
  { label: 'Ambiente', sx: { width: '15%' } },
  { label: 'Modelo', sx: { width: '20%' } },
  { label: 'Série', sx: { width: '10%' }, align: 'center' },
  { label: 'Número', sx: { width: '10%' }, align: 'center' },
  { label: 'Padrão', sx: { width: '15%' }, align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

export const SERIE_NFE_ENUM = {
  FORM_TABS,
  TABLE_HEADER,
};
