export * from './auth';
export * from './dashboard';

// ----------------------------------------------------------------------

export type AuthStateType = {
  loading: boolean;
  user: AuthUserType;
};

export type AuthUserType = null | Record<string, any>;

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
