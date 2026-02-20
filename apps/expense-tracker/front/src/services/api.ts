import axios from 'axios';

// ----------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

console.log('🔧 Frontend API Config:');
console.log('   API_URL:', API_URL);
console.log('   Environment:', process.env.NODE_ENV);

// ----------------------------------------------------------------------

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });

    // Erro de conexão (backend offline)
    if (error.code === 'ERR_CONNECTION_REFUSED' || error.code === 'ECONNREFUSED') {
      console.error('💡 Dica: Verifique se o backend está rodando em', API_URL);
      return Promise.reject(new Error('Servidor offline. Verifique se o backend está rodando.'));
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo de conexão esgotado. Tente novamente.'));
    }

    // Erro 401 - Não autorizado
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Só redireciona se não estiver já na página de login
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login/';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ API Health:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return false;
  }
};
