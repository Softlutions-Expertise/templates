'use client';

import { IOffauthContext } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function offauthContext(): Promise<IOffauthContext> {
  const response = await api.offauth.get(`/auth/me`);
  return response.data;
}

export const integracoesService = {
  offauthContext,
};
