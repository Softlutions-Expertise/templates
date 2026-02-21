'use client';

import axios from 'axios';

import { api } from '@/services';
import { getLocalItem } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function show(): Promise<any> {
  const response = await api.auth.get('/people/auth/business/userinfo', {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
    },
  });

  return response.data;
}

async function update(values: Record<string, any>): Promise<any> {
  const response = await axios.put(
    `https://central.lasercinemas.com.br/admin/realms/cinelaser/users/${getLocalItem('user')?.sub}`,
    { attributes: values },
  );

  return response.data;
}

export const userService = {
  show,
  update,
};
