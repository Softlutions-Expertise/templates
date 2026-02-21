'use client';

import { Container } from '@/components';
import { Box, Card, Typography } from '@mui/material';

import { useSettingsContext } from '@/components/settings';

// ----------------------------------------------------------------------

export function HomeView() {
  const settings = useSettingsContext();

  return (
    <Container>
      <Card>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src={`/assets/logo/logo_full_${settings.themeMode}.png`}
            sx={{ width: 400, height: 135, my: 2 }}
          />
          <Typography variant="h3" sx={{ mb: 5 }}>
            {'Gráficos estatísticos e muito mais em breve...'}
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
