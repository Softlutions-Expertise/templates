import { IUseCheckRoleProps } from "@softlutions/hooks";

// ----------------------------------------------------------------------

const LAYOUTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

export const pages = {
  page403: {
    path: '/error/403',
  },
  page404: {
    path: '/error/404',
  },
  page500: {
    path: '/error/500',
  },
  auth: {
    login: {
      path: `${LAYOUTS.AUTH}/login`,
    },
    forgotPassword: {
      path: `${LAYOUTS.AUTH}/forgot-password`,
    },
  },
  dashboard: {
    root: {
      path: LAYOUTS.DASHBOARD,
      roles: [] as IUseCheckRoleProps,
    },
    // Módulo de Exemplo - Clientes
    example: {
      list: {
        path: `${LAYOUTS.DASHBOARD}/example/list`,
        roles: [] as IUseCheckRoleProps,
      },
      create: {
        path: `${LAYOUTS.DASHBOARD}/example/create`,
        roles: [] as IUseCheckRoleProps,
      },
      edit: {
        path: (id: string | number) => `${LAYOUTS.DASHBOARD}/example/${id}/edit`,
        roles: [] as IUseCheckRoleProps,
      },
    },
  },
};
