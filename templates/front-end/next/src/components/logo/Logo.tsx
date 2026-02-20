'use client';

import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';

import { RouterLink } from '@/routes';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  width?: number | string;
  height?: number | string;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, width = 40, height = 40, ...other }, ref) => {
    const theme = useTheme();

    const logo = (
      <Box
        component="img"
        src="/assets/logo/logo_single.png"
        sx={{ width: width, height: height, cursor: 'pointer', ...sx }}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/dashboard/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  },
);
