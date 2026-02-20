'use client';

import { Container } from '@/components';
import { Box, Card, Typography, Button, Stack } from '@mui/material';
import { Iconify } from '@/components';
import { useSettingsContext } from '@/components/settings';
import { pages, useRouter } from '@/routes';

// ----------------------------------------------------------------------

export function HomeView() {
  const settings = useSettingsContext();
  const router = useRouter();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack spacing={3}>
        <Typography variant="h4">Dashboard</Typography>
        
        <Card sx={{ p: 5 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>
              Bem-vindo ao Template!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Este é um template limpo com autenticação e um módulo de exemplo (CRUD de Clientes).
              Use este template como base para seus projetos.
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Iconify icon="solar:users-group-rounded-bold" />}
                onClick={() => router.push(pages.dashboard.example.list.path)}
              >
                Ver Clientes
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Iconify icon="solar:add-circle-bold" />}
                onClick={() => router.push(pages.dashboard.example.create.path)}
              >
                Novo Cliente
              </Button>
            </Stack>
          </Box>
        </Card>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
          gap={3}
        >
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Iconify icon="solar:shield-check-bold" width={40} sx={{ color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">Autenticação</Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de login completo com JWT
            </Typography>
          </Card>

          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Iconify icon="solar:layers-bold" width={40} sx={{ color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">Material UI</Typography>
            <Typography variant="body2" color="text.secondary">
              Componentes modernos e responsivos
            </Typography>
          </Card>

          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Iconify icon="solar:code-square-bold" width={40} sx={{ color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">TypeScript</Typography>
            <Typography variant="body2" color="text.secondary">
              Tipagem forte e segura
            </Typography>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}
