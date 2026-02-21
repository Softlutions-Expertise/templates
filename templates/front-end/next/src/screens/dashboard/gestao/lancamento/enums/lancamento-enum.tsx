const OPERACAO = [
  { cod: 0, descricao: 'Entrada' },
  { cod: 1, descricao: 'Saída' },
];

const STATUS = {
  ['Editado']: 'warning',
  ['Efetivado']: 'success',
  ['Cancelado']: 'error',
} as { [key: string]: string };

const TABLE_HEADER = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Venda', sx: { width: '5%' }, align: 'center' },
  { label: 'Data', sx: { width: '15%' } },
  { label: 'Status', sx: { width: '5%' }, align: 'center' },
  { label: 'Forma Pagamento', sx: { width: '17%' }, align: 'center' },
  { label: 'Sub Forma Pagamento', sx: { width: '17%' }, align: 'center' },
  { label: 'Tipo Pagamento', sx: { width: '25%' }, align: 'center' },
  { label: 'Valor', sx: { width: 1 } },
  { label: 'Ações', sx: { width: '1%' } },
];

export const LANCAMENTO_ENUM = {
  OPERACAO,
  STATUS,
  TABLE_HEADER,
};
