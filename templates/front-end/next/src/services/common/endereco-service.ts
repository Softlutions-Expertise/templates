'use client';

import { api } from '@/services/config-service';

// ----------------------------------------------------------------------

const findAllEstado = () => api.offauth.get('/base/estados');

const findAllCidadeByIdEstado = (estadoId: string) =>
  api.offauth.get(`/base/cidades?filter.estadoId=${estadoId}`);

const findCidadeById = (id: string) => api.offauth.get(`/base/cidades/${id}`);

const findEstadoById = (id: string) => api.offauth.get(`/base/estados/${id}`);

const findOneEnderecoByCep = (cep: string) =>
  api.offauth.get(`/base/enderecos/cep/${cep}`);

// ----------------------------------------------------------------------

export const enderecoService = {
  findAllEstado,
  findAllCidadeByIdEstado,
  findCidadeById,
  findEstadoById,
  findOneEnderecoByCep,
};
