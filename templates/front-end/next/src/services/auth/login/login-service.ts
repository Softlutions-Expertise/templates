'use client';

import { CENTRAL_API } from '@/services';
import axios from 'axios';

// ----------------------------------------------------------------------

async function create(values: Record<string, any>) {
  const response = await axios.post(
    `${CENTRAL_API}/people/access/business`,
    values,
    {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      },
    },
  );
  return response.data;
}

export const LoginService = {
  create,
};
