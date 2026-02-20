import { IAuditoriaResponse, IAuditoriaFiltros, IUsuario, ISessao } from '@/models/auditoria';
import { api } from '@/services/config-service';

// ----------------------------------------------------------------------

const ENDPOINT = '/auditoria';

export const auditoriaService = {
  // Listar todas as auditorias (admin)
  listar: async (filtros: IAuditoriaFiltros = {}): Promise<IAuditoriaResponse> => {
    const params = new URLSearchParams();
    
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.jwtToken) params.append('jwtToken', filtros.jwtToken);
    if (filtros.acao) params.append('acao', filtros.acao);
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());

    const query = params.toString();
    const url = query ? `${ENDPOINT}?${query}` : ENDPOINT;

    const response = await api.local.fiscal.get(url);
    return response.data;
  },

  // Listar auditorias do usuário logado
  listarMinhas: async (filtros: Omit<IAuditoriaFiltros, 'usuarioId'> = {}): Promise<IAuditoriaResponse> => {
    const params = new URLSearchParams();
    
    if (filtros.jwtToken) params.append('jwtToken', filtros.jwtToken);
    if (filtros.acao) params.append('acao', filtros.acao);
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());

    const query = params.toString();
    const url = query ? `${ENDPOINT}/minhas?${query}` : `${ENDPOINT}/minhas`;

    const response = await api.local.fiscal.get(url);
    return response.data;
  },

  // Listar usuários para filtro (admin)
  listarUsuarios: async (): Promise<IUsuario[]> => {
    const response = await api.local.fiscal.get('/users');
    return response.data;
  },

  // Listar sessões (JWTs) de um usuário
  listarSessoes: async (usuarioId: string): Promise<ISessao[]> => {
    const response = await api.local.fiscal.get(`${ENDPOINT}/sessoes/${usuarioId}`);
    return response.data.data || [];
  },
};
