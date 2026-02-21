import { toDataURL } from 'qrcode';
import slug from 'slug';

const APP_PUBLIC_BASEURL =
  process.env.APP_PUBLIC_BASEURL ??
  'https://centraldevagas.defensoria.ro.def.br/';

const APP_PUBLIC_BASEURL_CLEAN = APP_PUBLIC_BASEURL.replace(/\/$/, '');

export const AppEnderecos = {
  app: APP_PUBLIC_BASEURL_CLEAN,

  getConsultaCidadeCpf: (estadoUf, cidade, cpf) => {
    if (!estadoUf || estadoUf.length !== 2 || !cidade || !cpf) return null;

    const cidadeSlug = slug(cidade);
    const cpfLimpo = cpf.replace(/\D/, '');
    const estadoUfLimpo = estadoUf.toLowerCase();

    return `${AppEnderecos.app}/portal/${estadoUfLimpo}/${cidadeSlug}/consultar-posicao/${cpfLimpo}/`;
  },

  getConsultaCidadeCpfFromEntrevista: (entrevista) => {
    return AppEnderecos.getConsultaCidadeCpf(
      entrevista.secretariaMunicipal?.endereco?.cidade?.estado?.uf,
      entrevista.secretariaMunicipal?.endereco?.cidade?.nome,
      entrevista?.crianca?.cpf,
    );
  },
};

export const generateQrCodeForLink = async (link) => {
  if (typeof link !== 'string') return;

  try {
    const dataUrl = await toDataURL(link);
    return dataUrl;
  } catch {}
  return null;
};
