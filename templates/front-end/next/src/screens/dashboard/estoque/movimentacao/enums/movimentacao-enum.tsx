const TABLE_HEADER = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Tipo', sx: { width: '12%' }, align: 'center' },
  { label: 'Natureza', sx: { width: '13%' }, align: 'center' },
  { label: 'Nome', sx: { width: '18%' } },
  { label: 'Status', sx: { width: '10%' }, align: 'center' },
  { label: 'Documento Referência', sx: { width: '12%' }, align: 'center' },
  { label: 'Quantidade Itens', sx: { width: '10%' }, align: 'center' },
  { label: 'Data Hora Movimento', sx: { width: 1 }, align: 'center' },
  { label: 'Ações', sx: { width: '0%' } },
];

const TABLE_HEADER_MERCADORIA = [
  { label: 'ID', sx: { width: '3%' } },
  { label: 'Descrição', sx: { width: '25%' } },
  { label: 'Quantidade', sx: { width: '15%' }, align: 'center' },
  { label: 'Saldo Anterior', sx: { width: '15%' }, align: 'center' },
  { label: 'Saldo Posterior', sx: { width: '15%' }, align: 'center' },
];

const TABLE_TABS = [
  { value: 'all', label: 'Todos' },
  { label: 'Entrada', color: 'success' },
  { label: 'Saída', color: 'error' },
  { label: 'Ajuste', color: 'warning' },
];

export const MOVIMENTACAO_ENUM = {
  TABLE_HEADER,
  TABLE_HEADER_MERCADORIA,
  TABLE_TABS,
};
