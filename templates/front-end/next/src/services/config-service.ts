'use client';

import axios from 'axios';

// ----------------------------------------------------------------------

const isDevelopment = process.env.NODE_ENV === 'development';

// URL base da API - usa a variável de ambiente ou fallback para localhost
// Backend NestJS default: port 3000
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (isDevelopment ? 'http://localhost:3000/api' : '');

// URL do serviço de relatórios (mesmo backend para template simplificado)
const REPORT_SERVICE_URL = 
  process.env.NEXT_PUBLIC_REPORT_SERVICE_URL || 
  (isDevelopment ? 'http://localhost:3000/api' : '');

// ----------------------------------------------------------------------

const api = {
  // API principal (NestJS)
  offauth: axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  // Serviço de relatórios
  report: axios.create({
    baseURL: REPORT_SERVICE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
};

// Interceptor para adicionar token de autenticação
api.offauth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.offauth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login em caso de não autorizado
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login/';
    }
    return Promise.reject(error);
  }
);

export { api, API_BASE_URL, REPORT_SERVICE_URL };
