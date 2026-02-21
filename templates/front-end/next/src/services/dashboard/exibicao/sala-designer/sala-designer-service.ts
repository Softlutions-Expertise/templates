'use client';

import { api } from '@/services/config-service';
import { ISalaDesignerDto, IPoltronaCreateUpdateDto } from '@/models';

// ----------------------------------------------------------------------

async function getSalaDesigner(id: number | string): Promise<ISalaDesignerDto> {
  const response = await api.booking.get(`/sala/designer/${id}`);
  return response.data;
}

async function createPoltrona(payload: IPoltronaCreateUpdateDto): Promise<{ id: number }> {
  const response = await api.booking.post('/poltrona', payload);
  return response.data;
}

async function updatePoltrona(id: number, payload: IPoltronaCreateUpdateDto): Promise<void> {
  const response = await api.booking.put(`/poltrona/${id}`, payload);
  return response.data;
}

export const salaDesignerService = {
  getSalaDesigner,
  createPoltrona,
  updatePoltrona,
};
