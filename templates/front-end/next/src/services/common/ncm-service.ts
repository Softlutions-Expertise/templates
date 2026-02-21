'use client';

import { api } from '@/services';

// ----------------------------------------------------------------------

async function findAll(search?: string): Promise<any> {
  const response = await api.bonbonniere.post(
    `/ncm/filter?search=${search || ''
    }&page=0&linesPerPage=10&orderBy=codigoFormatado&direction=DESC`,
  );
  return response.data;
}

export const ncmService = {
  findAll,
};
