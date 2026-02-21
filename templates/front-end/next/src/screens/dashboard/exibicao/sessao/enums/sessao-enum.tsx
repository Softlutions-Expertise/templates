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
  { label: 'Data Hora', align: 'left' },
  { label: 'Sala', align: 'left' },
  { label: 'Filme', align: 'left' },
  { label: 'Exibição', align: 'left' },
  { label: 'Canais', align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_HORARIOS_HEAD = [
  { id: 'actions', label: '', width: 50 },
  { id: 'sala', label: 'Sala', width: 50 },
  { id: 'salaRendas', label: 'Sala Rendas', width: 50 },
  { id: 'hora', label: 'Hora', width: 90 },
  { id: 'tipoSessao', label: 'Tipo Sessão', width: 110 },
  { id: 'tipoProjecao', label: 'Tipo Projeção', width: 50 },
  { id: 'idiomaExibicao', label: 'Idioma', width: 80 },
];

export const SESSAO_ENUM = {
  TABLE_HEADER,
  FORM_TABS,
  TABLE_HORARIOS_HEAD,
};
