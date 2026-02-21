import { pages } from '@/routes';
import { api } from '@/services';
import { removeSessionItem, setSessionItem } from '@softlutions/utils';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    removeSessionItem('accessToken');

    window.location.href = pages.auth.login.path;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    setSessionItem('accessToken', accessToken);

    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    removeSessionItem('accessToken');
  }

  Object.values(api).forEach(function apply(item: any) {
    if (item?.defaults?.baseURL) {
      item.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      item.defaults.headers.common['x-api-key'] = process.env.NEXT_PUBLIC_API_KEY || '';
    } else if (typeof item === 'object' && item !== null) {
      Object.values(item).forEach(apply);
    }
  });

};
