import { toDataURL } from 'qrcode';
import slug from 'slug';

const APP_PUBLIC_BASEURL =
  process.env.APP_PUBLIC_BASEURL ?? 'http://localhost:3000';

const APP_PUBLIC_BASEURL_CLEAN = APP_PUBLIC_BASEURL.replace(/\/$/, '');

export const AppEnderecos = {
  app: APP_PUBLIC_BASEURL_CLEAN,
};

export const generateQrCodeForLink = async (link: string): Promise<string | null> => {
  if (typeof link !== 'string') return null;

  try {
    const dataUrl = await toDataURL(link);
    return dataUrl;
  } catch {}
  return null;
};
