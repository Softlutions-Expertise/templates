'use client';

import { Breadcrumbs } from '@/components';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { useRouter } from 'src/routes/hooks';

import { pages } from '@/routes';
import { CalendarEventsYear } from '../components';

// ----------------------------------------------------------------------

const STYLES_CARD = {
  backgroundColor: 'primary.main',
  color: 'white',
  opacity: 0.7,
  borderRadius: '50%',
  cursor: 'pointer',
  width: 35,
  height: 35,
  p: 0.3,
  mr: 1,
  transition: 'box-shadow 0.3s ease,  transform 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'scale(0.98)',
  },
};

// ----------------------------------------------------------------------

export function CalendarioListView() {
  const settings = useSettingsContext();
  const router = useRouter();

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [render, setRender] = useState<boolean>(true);
  const [showAllEvents] = useState<boolean>(false);

  useEffect(() => {
    if (render) settings.onUpdate('themeLayout', 'mini');
    setRender(false);
  }, [year, render, settings]);

  const handlePrevYear = () => setYear(year - 1);

  const handleNextYear = () => setYear(year + 1);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Breadcrumbs
        heading="Calendário de Envios SCB"
        links={[{ name: 'Dashboard', href: pages.dashboard.root.path }, { name: 'Calendário' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              ...STYLES_CARD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handlePrevYear}
          >
            <ArrowBackIosNewIcon />
          </Box>
          <Typography variant="h3">{year}</Typography>
          <Box
            sx={{
              ...STYLES_CARD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleNextYear}
          >
            <ArrowForwardIosIcon />
          </Box>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {[...Array(12)].map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={4}>
            <CalendarEventsYear
              month={index + 1}
              year={year}
              forceShowEvents={showAllEvents}
              onClick={() => {
                router.push(pages.dashboard.exibicao.scb.calendario.newEdit.path(year, index + 1));
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
