'use client';

import { Container as MuiContainer } from '@mui/material';

import { useSettingsContext } from '@/components/settings';

// ----------------------------------------------------------------------

export function Container({ children }: { children: React.ReactNode }) {
  const settings = useSettingsContext();

  return <MuiContainer maxWidth={settings.themeStretch ? false : 'lg'}>{children}</MuiContainer>;
}
