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
  offauth: axios.create({
    baseURL: `${LOCAL_API}/offauth`,
  }),
  cashway: axios.create({
    baseURL: `${CENTRAL_API}/cashway`,
  }),
  banners: axios.create({
    baseURL: `${CENTRAL_API}/banners`,
  }),
  bonbonniere: axios.create({
    baseURL: `${CENTRAL_API}/bonbonniere`,
  }),
  business: axios.create({
    baseURL: `${CENTRAL_API}/business`,
  }),
  local: {
    fiscal: axios.create({
      baseURL: `${LOCAL_API}/fiscal`,
    }),
    scb: axios.create({
      baseURL: `${LOCAL_API}/scb`,
    }),
    views: axios.create({
      baseURL: `${LOCAL_API}/views`,
    }),
    warehouse: axios.create({
      baseURL: `${LOCAL_API}/warehouse`,
    }),
  },
  locus: axios.create({
    baseURL: `${CENTRAL_API}/locus`,
  }),
  movies: axios.create({
    baseURL: `${CENTRAL_API}/movies`,
  }),
  people: axios.create({
    baseURL: `${CENTRAL_API}/people`,
  }),
  suppliers: axios.create({
    baseURL: `${CENTRAL_API}/suppliers`,
  }),
  specta: axios.create({
    baseURL: `${CENTRAL_API}/specta`,
  }),
  user: axios.create({
    baseURL: `${CENTRAL_API}/users`,
  }),
  visum: axios.create({
    baseURL: `${CENTRAL_API}/visum`,
  }),
  booking: axios.create({
    baseURL: `${LOCAL_API}/booking`,
  }),
  income: axios.create({
    baseURL: `${LOCAL_API}/income`,
  }),
  cashbox: axios.create({
    baseURL: `${LOCAL_API}/cashbox`,
  }),
  pay: axios.create({
    baseURL: `${LOCAL_API}/pay`,
  }),
};


export { api };

