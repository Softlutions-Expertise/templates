'use client';

import { api } from '@/services/config-service';

// ----------------------------------------------------------------------

async function show(): Promise<any> {
  const response = await api.offauth.get('/auth/me');
  return response.data;
}

async function update(values: Record<string, any>): Promise<any> {
  const response = await api.offauth.put('/auth/me', values);
  return response.data;
}

export const userService = {
  show,
  update,
};
