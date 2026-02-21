import { IconBadge } from '@/components';

// ----------------------------------------------------------------------

const FORM_TABS = [
  {
    value: 'mensagens',
    label: 'Mensagens',
    icon: <IconBadge>1</IconBadge>,
  },
  {
    value: 'sessoes',
    label: 'Sessões',
    icon: <IconBadge>2</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'Sala', sx: { width: '21%' } },
  { label: 'Data Cinematográfica', sx: { width: '21%' } },
  { label: 'Data/Hora Envio', sx: { width: '20%' } },
  { label: 'Houve Sessões', sx: { width: '17%' }, align: 'center' },
  { label: 'Retificadora', sx: { width: '13%' }, align: 'center' },
  { label: 'Retificada', sx: { width: '13%' }, align: 'center' },
  { label: 'Status', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '0%' } },
];

export const BILHETERIA_ENUM = {
  TABLE_HEADER,
  FORM_TABS,
};
