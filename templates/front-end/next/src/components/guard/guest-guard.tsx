import { useAuthContext } from '@/hooks';
import { pages, useRouter, useSearchParams } from '@/routes';
import { useCallback, useEffect } from 'react';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export function GuestGuard({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo') || pages.dashboard.root.path;

  const { authenticated } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(returnTo);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
