import { Logo } from '@/components';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { getLocalItem } from '@softlutions/utils';

import { NavSectionMini } from '@/layouts/common';
import { hideScroll } from '@/theme/css';

import { NavToggleButton } from '../common';
import { NAV } from '../config-layout';
import { useNavData } from './dashboard-config-navigation';

// ----------------------------------------------------------------------

export function DashboardNavMini() {
  const navData = useNavData();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
          data={navData}
          config={{
            currentRole: getLocalItem('user')?.authorities,
          }}
        />
      </Stack>
    </Box>
  );
}
