import { ILancamentoContext, ILancamentoCreateEdit } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function create(data: ILancamentoCreateEdit): Promise<{ id: number }> {
  const response = await api.cashbox.post(`/lancamentos/manual`, data);
  return response.data;
}

async function findOneById(id: string | number): Promise<ILancamentoCreateEdit> {
  const response = await api.cashbox.get(`/lancamentos/${id}`);
  return response.data;
}

async function update(data: ILancamentoCreateEdit): Promise<void> {
  const { id, ...rest } = data;
  const response = await api.cashbox.put(`/lancamentos/${id}`, rest);
  return response.data;
}

async function context(): Promise<ILancamentoContext> {
  const response = await api.cashbox.get(`/parametros/context`);
  return response.data;
}

async function extrato(data: string): Promise<ILancamentoContext> {
  const response = await api.income.post(`/ticket/tef-relatorio`, { data });
  return response.data;
}

export const lancamentoService = {
  create,
  findOneById,
  update,
  context,
  extrato,
};
