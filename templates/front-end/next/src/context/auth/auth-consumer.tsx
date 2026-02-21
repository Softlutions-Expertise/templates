'use client';

import { SplashScreen } from '@/components';

import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(auth) => (auth.loading ? <SplashScreen /> : children)}
    </AuthContext.Consumer>
  );
}
