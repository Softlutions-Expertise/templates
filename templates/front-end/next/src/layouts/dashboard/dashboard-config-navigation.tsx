import { Iconify, SvgColor } from '@/components';
import { useMemo } from 'react';

import { pages } from '@/routes';
import { useLocales } from '@/theme/locales';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  colaborador: icon('ic_job'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        subheader: t('Pessoas'),
        items: [
          {
            title: t('Colaboradores'),
            path: pages.dashboard.pessoa.colaborador.list.path,
            icon: ICONS.colaborador,
            roles: pages.dashboard.pessoa.colaborador.list.roles,
          },
        ],
      },
    ],
    [t],
  );

  return data;
}
