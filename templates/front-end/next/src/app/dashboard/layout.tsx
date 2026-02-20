'use client';

import { AuthGuard } from '@/components';
import { useAuthContext } from '@/hooks';
import { DashboardLayout } from '@/layouts';
import { usePathname, useRolePathname, useRouter } from '@/routes';
import { useCheckRole } from '@softlutions/hooks';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode; 
}

export default function Layout({ children }: Props) {
const pathname = usePathname();
const router = useRouter();

const { logout } = useAuthContext();
const { checkRole } = useCheckRole();

  useEffect(() => {
    const roles: string[] = useRolePathname(pathname)?.roles;
    if(roles && roles?.length > 0 && !checkRole(roles as any)){
      console.log('no permission');
      console.log(useRolePathname(pathname)?.matchedPath,useRolePathname(pathname)?.keyChain, roles);
      logout();
      router.replace('/');
    }
  }, [pathname]);
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
