'use client';

import { api } from '@/services/config-service';

// ----------------------------------------------------------------------

async function create(values: Record<string, any>) {
  const response = await api.offauth.post('/auth/login', values);
  return response.data;
}

export const LoginService = {
  create,
};
