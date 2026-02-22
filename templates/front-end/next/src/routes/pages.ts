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
    pessoa: {
      colaborador: {
        list: {
          path: `${LAYOUTS.DASHBOARD}/pessoa/colaborador/list`,
          roles: [] as IUseCheckRoleProps,
        },
      },
    },
  },
};
