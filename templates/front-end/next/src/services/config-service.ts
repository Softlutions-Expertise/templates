'use client';

import axios from 'axios';

// ----------------------------------------------------------------------
const isDevelopment = process.env.NODE_ENV === 'development';

let host = '';

if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  host = url.hostname.toString().substring(0, url.hostname.toString().indexOf('.br') + 3);
}

export const CENTRAL_API = process.env.NEXT_PUBLIC_CENTRAL_API;

export const LOCAL_API = isDevelopment
  ? process.env.NEXT_PUBLIC_LOCAL_API
  : `https://${host || ''}`;

// ----------------------------------------------------------------------

const api = {
  auth: axios.create({
    baseURL: `${CENTRAL_API}`,
  }),
  user: axios.create({
    baseURL: `${CENTRAL_API}/users`,
  }),
  local: {
    fiscal: axios.create({
      baseURL: `${LOCAL_API}/api`,
    }),
  },
};

export { api };
