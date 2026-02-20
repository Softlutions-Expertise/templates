export interface IAuditoria {
  id: string;
  usuarioId: string | null;
  usuarioEmail: string | null;
  acao: 'login' | 'create' | 'update' | 'delete';
  entidade: string;
  entidadeId: string | null;
  dadosAnteriores: Record<string, any> | null;
  dadosNovos: Record<string, any> | null;
  descricao: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  jwtToken: string | null;
  createdAt: string;
}

export interface IAuditoriaFiltros {
  usuarioId?: string;
  jwtToken?: string;
  acao?: 'login' | 'create' | 'update' | 'delete';
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

export interface IAuditoriaResponse {
  data: IAuditoria[];
  total: number;
  page: number;
  limit: number;
}

export interface IUsuario {
  id: string;
  email: string;
  name: string;
}

export interface ISessao {
  id: string;
  numero: number;
  dataInicio: string;
  dataFim: string;
  totalAcoes: number;
  ipAddress: string | null;
  userAgent: string | null;
}

/**
 * Decodifica um JWT token (sem verificar assinatura)
 * Retorna o payload decodificado ou null se inválido
 */
export function decodeJWT(token: string): { header: any; payload: any; signature: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decodeBase64 = (str: string) => {
      // Adiciona padding se necessário
      const padding = '='.repeat((4 - str.length % 4) % 4);
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
      return JSON.parse(atob(base64));
    };

    return {
      header: decodeBase64(parts[0]),
      payload: decodeBase64(parts[1]),
      signature: parts[2],
    };
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}
