import { IconBadge } from '@/components';
import { ISolicitacaoAjusteFinalizeForm } from '@/models';

// ----------------------------------------------------------------------

const DEFAULT_FINALIZE_FORM: ISolicitacaoAjusteFinalizeForm = {
  type: 'default',
  load: false,
  disabled: {
    default: false,
    salvar: false,
    enviar: false,
    responder: false,
  },
};

const FORM_TABS = [
  {
    value: 'mercadoria',
    label: 'Mercadorias',
    icon: <IconBadge>1</IconBadge>,
  },
  {
    value: 'historico',
    label: 'Histórico',
    icon: <IconBadge>2</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Status', sx: { width: '10%' } },
  { label: 'Quantidade de Itens', sx: { width: '28%' }, align: 'center' },
  { label: 'Data Hora Status', sx: { width: '25%' } },
  { label: 'Data e Hora Requisição', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_HEADER_HISTORICO = [
  { label: 'Código', sx: { width: '3%' } },
  { label: 'Supervisor Nome', sx: { width: '24%' } },
  { label: 'Supervisor Email', sx: { width: '24%' } },
  { label: 'Motivo', sx: { width: 1 } },
  { label: 'Status', sx: { width: '0%' } },
];

const TABLE_HEADER_MERCADORIA = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Descrição', sx: { width: '28%' } },
  { label: 'Motivo', sx: { width: '25%' } },
  { label: 'Saldo a calcular', sx: { width: '17%' }, align: 'center' },
  { label: 'Operação', sx: { width: 1 }, align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_TABS = [
  { value: 'all', label: 'Todos' },
  { label: 'Em Edição', color: 'info' },
  { label: 'Aguardando', color: 'warning' },
  { label: 'Aprovada', color: 'success' },
  { label: 'Cancelada', color: 'error' },
  { label: 'Rejeitada', color: 'secondary' },
];

export const SOLICITACAO_AJUSTE_ENUM = {
  DEFAULT_FINALIZE_FORM,
  FORM_TABS,
  TABLE_HEADER,
  TABLE_HEADER_HISTORICO,
  TABLE_HEADER_MERCADORIA,
  TABLE_TABS,
};
