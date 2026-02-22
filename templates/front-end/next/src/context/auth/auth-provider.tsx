'use client';

import { ActionMapType, AuthStateType, AuthUserType } from '@/models';
import { pages, useRouter } from '@/routes';
import { LoginService, userService } from '@/services';

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

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }, [setRole]);

  // REGISTER (não implementado)
  const register = useCallback(async () => {
    throw new Error('Register not implemented');
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
    router.push(pages.auth.login.path);
  }, [router]);

  const value = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: state.loading,
      authenticated: !!state.user,
      unauthenticated: !state.user,
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, state.loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
