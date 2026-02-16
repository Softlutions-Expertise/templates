import { Iconify, SvgColor } from '@/components';
import { useMemo } from 'react';

import { pages } from '@/routes';
import { useLocales } from '@/theme/locales';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const iconFy = (name: string) => (
  <Iconify icon={`solar:${name}-bold-duotone`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  example: iconFy('users-group-rounded'),
  settings: iconFy('settings'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        subheader: t('geral'),
        items: [
          {
            title: t('dashboard'),
            path: pages.dashboard.root.path,
            icon: ICONS.dashboard,
            roles: pages.dashboard.root.roles,
          },
        ],
      },
      {
        subheader: t('módulos'),
        items: [
          {
            title: t('exemplo - clientes'),
            path: '#disabled',
            icon: ICONS.example,
            roles: pages.dashboard.example.list.roles,
            children: [
              {
                title: t('listar'),
                path: pages.dashboard.example.list.path,
              },
              {
                title: t('criar novo'),
                path: pages.dashboard.example.create.path,
              },
            ],
          },
        ],
      },
    ],
    [t],
  );

  return data;
}
