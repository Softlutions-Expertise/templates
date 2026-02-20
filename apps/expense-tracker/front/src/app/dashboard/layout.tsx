'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Alert, Button } from '@mui/material';

import { DashboardLayout } from '@layouts/dashboard/dashboard-layout';
import { useAuth } from '@hooks/use-auth';

// ----------------------------------------------------------------------

interface LayoutProps {
  children: ReactNode;
}

// ----------------------------------------------------------------------

export default function DashboardRootLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, apiStatus, checkConnection } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && apiStatus !== 'offline') {
      router.replace('/auth/login/');
    }
  }, [isLoading, isAuthenticated, apiStatus, router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // API offline
  if (apiStatus === 'offline') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={checkConnection}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível conectar ao servidor. Verifique se o backend está
          rodando em http://localhost:3001
        </Alert>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
