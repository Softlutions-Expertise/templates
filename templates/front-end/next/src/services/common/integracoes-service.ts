'use client';

import { IIntegracoesFinanca, IIntegracoesPessoa, IOffauthContext } from '@/models';

import { api } from '@/services';

// ----------------------------------------------------------------------

async function bonbonniereContext(): Promise<any> {
  const response = await api.bonbonniere.get(`/integracao/context`);

  return response.data;
}

async function financaContext(): Promise<IIntegracoesFinanca> {
  const response = await api.cashway.get(`/integracao/context`);

  return response.data;
}

async function pessoaContext(): Promise<IIntegracoesPessoa> {
  const response = await api.people.get(`/integracao/context`);

  return response.data;
}

async function offauthContext(): Promise<IOffauthContext> {
  const response = await api.offauth.get(`/integracao/context`);

  return response.data;
}


export const integracoesService = {
  bonbonniereContext,
  financaContext,
  pessoaContext,
  offauthContext,
};
