import { Box } from '@mui/material';
import { useBoolean, useResponsive } from '@softlutions/hooks';

import { useSettingsContext } from '@/components/settings';

import { DasboardMain } from './dasboard-main';
import { DasboardNavHorizontal } from './dasboard-nav-horizontal';
import { DashboardNavMini } from './dasboard-nav-mini';
import { DashboardNavVertical } from './dasboard-nav-vertical';
import { DashboardHeader } from './dashboard-header';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <DashboardNavMini />;

  const renderHorizontal = <DasboardNavHorizontal />;

  const renderNavVertical = <DashboardNavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isHorizontal) {
    return (
      <>
        <DashboardHeader onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <DasboardMain>{children}</DasboardMain>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <DashboardHeader onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <DasboardMain>{children}</DasboardMain>
        </Box>
      </>
    );
  }

  return (
    <>
      <DashboardHeader onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {renderNavVertical}

        <DasboardMain>{children}</DasboardMain>
      </Box>
    </>
  );
}
