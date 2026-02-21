import { IconBadge } from '@/components';
import { INotaFiscalFinalizeForm } from '@/models';

// ----------------------------------------------------------------------

const DEFAULT_FINALIZE_FORM: INotaFiscalFinalizeForm = {
  type: 'default',
  load: false,
  disabled: {
    default: false,
    salvar: false,
    transmitir: false,
    excluir: false,
    cancelar: false,
    imprimir: false,
    email: false,
    danfe: false,
  },
};

const FORM_TABS = [
  {
    value: 'emitente',
    label: 'Emitente',
    icon: <IconBadge>1</IconBadge>,
  },
  {
    value: 'destinatario',
    label: 'Destinatário',
    icon: <IconBadge>2</IconBadge>,
  },
  {
    value: 'processo',
    label: 'Processo',
    icon: <IconBadge>3</IconBadge>,
  },
  {
    value: 'mercadorias',
    label: 'Mercadorias',
    icon: <IconBadge>4</IconBadge>,
  },

  {
    value: 'fatura',
    label: 'Fatura',
    icon: <IconBadge>5</IconBadge>,
    disabled: true,
  },
  {
    value: 'logistica',
    label: 'Logística',
    icon: <IconBadge>6</IconBadge>,
  },
  {
    value: 'referencias',
    label: 'Referências',
    icon: <IconBadge>7</IconBadge>,
  },
  {
    value: 'pagamentos',
    label: 'Pagamentos',
    icon: <IconBadge>8</IconBadge>,
  },
  {
    value: 'protocolo',
    label: 'Protocolo',
    icon: <IconBadge>9</IconBadge>,
  },
];

const TABLE_HEADER = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Tipo Movimento', sx: { width: '13%' }, align: 'center' },
  { label: 'Status', sx: { width: '12%' } },
  { label: 'Nome', sx: { width: '35%' } },
  { label: 'Série', sx: { width: '9%' }, align: 'center' },
  { label: 'Número', sx: { width: '11%' }, align: 'center' },
  { label: 'Data e Hora', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_HEADER_MERCADORIA = [
  { label: 'Código', sx: { width: '5%' } },
  { label: 'Descrição', sx: { width: '20%' } },
  { label: 'Medida', sx: { width: '5%' } },
  { label: 'NCM', sx: { width: '5%' } },
  { label: 'CEST', sx: { width: '5%' } },
  { label: 'ICMS CST / CSOSN', sx: { width: '15%' } },
  { label: 'PIS CST', sx: { width: '7%' } },
  { label: 'COFINS CST', sx: { width: '9%' } },
  { label: 'Quantidade', sx: { width: '8%' } },
  { label: 'Valor Unidade', sx: { width: '10%' } },
  { label: 'Valor Desconto', sx: { width: '10%' } },
  { label: 'Valor Total', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_HEADER_PAGAMENTOS = [
  { label: 'Código', sx: { width: '5%' } },
  { label: 'Forma Pagamento', sx: { width: '25%' } },
  { label: 'Tipo Pagamento', sx: { width: '25%' } },
  { label: 'Valor', sx: { width: '10%' } },
  { label: 'Data', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_HEADER_PROTOCOLO = [
  { label: 'Versão', sx: { width: '10%' } },
  { label: 'Tentativa', sx: { width: '10%' } },
  { label: 'Série Nota', sx: { width: '12%' } },
  { label: 'Número Nota', sx: { width: '15%' } },
  { label: 'Chave Acesso', sx: { width: '15%' } },
  { label: 'Motivo', sx: { width: '10%' } },
  { label: 'Protocolo', sx: { width: 1 } },
  { label: 'Protocolo Data Hora', sx: { width: '14%' } },
];

export const NOTA_FISCAL_ENUM = {
  DEFAULT_FINALIZE_FORM,
  TABLE_HEADER,
  TABLE_HEADER_MERCADORIA,
  TABLE_HEADER_PAGAMENTOS,
  TABLE_HEADER_PROTOCOLO,
  FORM_TABS,
};
