import { memo } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getLocalItem } from '@softlutions/utils';

import { NavSectionHorizontal } from '@/layouts/common';
import { bgBlur } from '@/theme/css';

import { HeaderShadow } from '../common';
import { HEADER } from '../config-layout';
import { useNavData } from './dashboard-config-navigation';

// ----------------------------------------------------------------------

export const DasboardNavHorizontal = memo(() => {
  const theme = useTheme();

  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal
          data={navData}
          config={{
            currentRole: getLocalItem('user')?.authorities,
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
});

export default DasboardNavHorizontal;
