import { IExample, IExampleCreate, IExampleUpdate } from '@/models';
import { api } from '@/services/config-service';

// ----------------------------------------------------------------------

const ENDPOINT = '/examples';

export const exampleService = {
  // Listar todos
  list: async (): Promise<IExample[]> => {
    const response = await api.local.fiscal.get(ENDPOINT);
    return response.data;
  },

  // Buscar um
  show: async (id: string): Promise<IExample> => {
    const response = await api.local.fiscal.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  // Criar
  create: async (data: IExampleCreate): Promise<IExample> => {
    const response = await api.local.fiscal.post(ENDPOINT, data);
    return response.data;
  },

  // Atualizar
  update: async (id: string, data: IExampleUpdate): Promise<IExample> => {
    const response = await api.local.fiscal.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Deletar
  delete: async (id: string): Promise<void> => {
    await api.local.fiscal.delete(`${ENDPOINT}/${id}`);
  },
};
