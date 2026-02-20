'use client';

import { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}
          >
            💰 Expense Tracker
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            {title}
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
