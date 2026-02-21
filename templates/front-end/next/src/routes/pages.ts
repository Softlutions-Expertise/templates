import { IUseCheckRoleProps } from "@softlutions/hooks";
import { create } from "lodash";

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
    contabil: {
      fiscal: {
        notaFiscal: {
          create: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/nota-fiscal/create`,
            roles: [] as IUseCheckRoleProps,
          },
          list: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/nota-fiscal/list`,
            roles: [] as IUseCheckRoleProps,
          },
          edit: {
            path: (id: string | number) => `${LAYOUTS.DASHBOARD}/contabil/fiscal/nota-fiscal/${id}/edit`,
            roles: [] as IUseCheckRoleProps,
          },
        },
        parametro: {
          edit: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/parametro/edit`,
            roles: ['supervisor', 'admin', 'master'] as IUseCheckRoleProps,
          },
        },
        downloads: {
          path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/downloads`,
          roles: [] as IUseCheckRoleProps,
        },
        inutilizacao: {
          create: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/inutilizacao/create`,
            roles: [] as IUseCheckRoleProps,
          },
          list: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/inutilizacao`,
            roles: [] as IUseCheckRoleProps,
          },
          view: {
            path: (id: string | number) => `${LAYOUTS.DASHBOARD}/contabil/fiscal/inutilizacao/${id}/viewer`,
            roles: [] as IUseCheckRoleProps,
          },
        },
        serieNfe: {
          create: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/serie-nfe/create`,
            roles: [] as IUseCheckRoleProps,
          },
          list: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/serie-nfe/list`,
            roles: [] as IUseCheckRoleProps,
          },
          edit: {
            path: (ambiente: string | number, modelo: string | number, serie: string | number) =>
              `${LAYOUTS.DASHBOARD}/contabil/fiscal/serie-nfe/edit?ambiente=${ambiente}&modelo=${modelo}&serie=${serie}`,
            roles: [] as IUseCheckRoleProps,
          },
        },
        regraTributaria: {
          create: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/regra-tributaria/create`,
            roles: [] as IUseCheckRoleProps,
          },
          list: {
            path: `${LAYOUTS.DASHBOARD}/contabil/fiscal/regra-tributaria/list`,
            roles: [] as IUseCheckRoleProps,
          },
          edit: {
            path: (id: string | number) => `${LAYOUTS.DASHBOARD}/contabil/fiscal/regra-tributaria/${id}/edit`,
            roles: [] as IUseCheckRoleProps,
          },
          view: {
            path: (id: string | number) => `${LAYOUTS.DASHBOARD}/contabil/fiscal/regra-tributaria/${id}/viewer`,
            roles: [] as IUseCheckRoleProps,
          },
        },
      },
    },
    estoque: {
      mercadoria: {
        create: {
          path: `${LAYOUTS.DASHBOARD}/estoque/mercadoria/create`,
          roles: [] as IUseCheckRoleProps,
        },
        list: {
          path: `${LAYOUTS.DASHBOARD}/estoque/mercadoria/list`,
          roles: [] as IUseCheckRoleProps,
        },
        edit: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/estoque/mercadoria/${id}/edit`,
          roles: [] as IUseCheckRoleProps,
        },
        configuracaoEntrada: {
          create: {
            path: `${LAYOUTS.DASHBOARD}/estoque/mercadoria/configuracao-entrada/create`,
            roles: [] as IUseCheckRoleProps,
          },
          list: {
            path: `${LAYOUTS.DASHBOARD}/estoque/mercadoria/configuracao-entrada/list`,
            roles: [] as IUseCheckRoleProps,
          },
          edit: {
            path: (id: string | number) => `${LAYOUTS.DASHBOARD}/estoque/mercadoria/configuracao-entrada/${id}/edit`,
            roles: [] as IUseCheckRoleProps,
          },
        },
      },
      movimentacao: {
        list: {
          path: `${LAYOUTS.DASHBOARD}/estoque/movimentacao/list`,
          roles: [] as IUseCheckRoleProps,
        },
        viewer: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/estoque/movimentacao/${id}/viewer`,
          roles: [] as IUseCheckRoleProps,
        },
      },
      solicitacaoAjuste: {
        create: {
          path: `${LAYOUTS.DASHBOARD}/estoque/solicitacao-ajuste/create`,
          roles: [] as IUseCheckRoleProps,
        },
        list: {
          path: `${LAYOUTS.DASHBOARD}/estoque/solicitacao-ajuste/list`,
          roles: [] as IUseCheckRoleProps,
        },
        edit: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/estoque/solicitacao-ajuste/${id}/edit`,
          roles: [] as IUseCheckRoleProps,
        },
      },
    },
    estabelecimento: {
      relatorio: {
        caixa: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/caixa`,
          roles: [] as IUseCheckRoleProps,
        },
        exibicao: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/exibicao`,
          roles: [] as IUseCheckRoleProps,
        },
        fiscal: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/fiscal`,
          roles: [] as IUseCheckRoleProps,
        },
        ingresso: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/ingresso`,
          roles: [] as IUseCheckRoleProps,
        },
        produto: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/produto`,
          roles: [] as IUseCheckRoleProps,
        },
        rendaBordero: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/rendaBordero`,
          roles: [] as IUseCheckRoleProps,
        },
        venda: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/venda`,
          roles: [] as IUseCheckRoleProps,
        },
        estoque: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/relatorio/estoque`,
          roles: [] as IUseCheckRoleProps,
        },
      },
      painelDigital: {
        create: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/painel-digital/create`,
          roles: [] as IUseCheckRoleProps,
        },
        list: {
          path: `${LAYOUTS.DASHBOARD}/estabelecimento/painel-digital/list`,
          roles: [] as IUseCheckRoleProps,
        },
        edit: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/estabelecimento/painel-digital/${id}/edit`,
          roles: [] as IUseCheckRoleProps,
        },
      },
    },
    exibicao: {
      scb: {
        bilheteria: {
          list: {
            path: `${LAYOUTS.DASHBOARD}/exibicao/scb/bilheteria/list`,
            roles: [] as IUseCheckRoleProps,
          },
          viewer: {
            path: (id: string | number) => `${LAYOUTS.DASHBOARD}/exibicao/scb/bilheteria/${id}/viewer`,
            roles: [] as IUseCheckRoleProps,
          },
        },
        calendario: {
          list: {
            path: `${LAYOUTS.DASHBOARD}/exibicao/scb/calendario/list`,
            roles: [] as IUseCheckRoleProps,
          },
          newEdit: {
            path: (year: string | number, month: string | number) => `${LAYOUTS.DASHBOARD}/exibicao/scb/calendario/eventos/${year}/${month}`,
            roles: [] as IUseCheckRoleProps,
          },
        },
      },
      sessao: {
        list: {
          path: `${LAYOUTS.DASHBOARD}/exibicao/sessao/list`,
          roles: [] as IUseCheckRoleProps,
        },
        viewer: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/exibicao/sessao/${id}/viewer`,
          roles: [] as IUseCheckRoleProps,
        },
        create: {
          path: `${LAYOUTS.DASHBOARD}/exibicao/sessao/create`,
          roles: [] as IUseCheckRoleProps,
        },
        edit: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/exibicao/sessao/${id}/edit`,
          roles: [] as IUseCheckRoleProps,
        },
      },
      sala: {
        list: {
          path: `${LAYOUTS.DASHBOARD}/exibicao/sala/list`,
          roles: [] as IUseCheckRoleProps,
        },
        create: {
          path: `${LAYOUTS.DASHBOARD}/exibicao/sala/create`,
          roles: [] as IUseCheckRoleProps,
        },
        edit: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/exibicao/sala/${id}/edit`,
          roles: [] as IUseCheckRoleProps,
        },
        mapaPoltronas: {
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/exibicao/sala/${id}/mapa-poltronas`,
          roles: [] as IUseCheckRoleProps,
        },
      },
      filme: {
         list: {
          path: `${LAYOUTS.DASHBOARD}/exibicao/filme/list`,
          roles: [] as IUseCheckRoleProps,
        },
      },
    },
    gestao: {
      vendas: {
        list: {
          path: `${LAYOUTS.DASHBOARD}/gestao/vendas/list`,
          roles: [] as IUseCheckRoleProps,
        },
        viewer: {
          path: `${LAYOUTS.DASHBOARD}/gestao/vendas/viewer`,
          roles: [] as IUseCheckRoleProps,
        },
      },
      lancamento: {
        list: {
          path: `${LAYOUTS.DASHBOARD}/gestao/lancamento/list`,
          roles: [] as IUseCheckRoleProps,
        },
      },
      
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
