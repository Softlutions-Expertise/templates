'use client';

import { ActionMapType, AuthStateType, AuthUserType } from '@/models';
import { pages, useRouter } from '@/routes';
import { LoginService, unidadeService, userService } from '@/services';

import { getLocalItem, getSessionItem, setLocalItem } from '@softlutions/utils';
import jwtDecode from 'jwt-decode';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { useCheckRole } from '@softlutions/hooks';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const { setRole } = useCheckRole();

  const [state, dispatch] = useReducer(reducer, initialState);

  const clean = (value?: string) => {
    const cleaned = (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9-_]/g, '');

    if (cleaned === 'administrador') {
      return 'admin';
    }
    
    return cleaned;
  };

  const initialize = useCallback(async () => {
    try {
      const accessToken = getSessionItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const user = getLocalItem('user') as AuthUserType;

        setRole(clean(user?.profile?.descricao));

        await unidadeService.loadCurrentUnidade().catch((error) => console.error('❌ Erro ao carregar unidade na inicialização:', error));

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const accessToken = await LoginService.create({
      username: email,
      password,
    }).then((response: Record<string, any>) => response.access_token);
    setSession(accessToken);
    setLocalItem('authorization', accessToken);

    const user = await userService.show().then((response: Record<string, any>) => response);
    setLocalItem('user', { ...user, ...jwtDecode(accessToken) });

    setRole(clean(user?.profile?.descricao));

    await unidadeService.loadCurrentUnidade()
      .catch((error) => console.error('❌ Erro ao carregar unidade no login:', error));

    if (user?.updatePassword == true) router.push(pages.auth.forgotPassword.path);
    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async () => { }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status],
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
