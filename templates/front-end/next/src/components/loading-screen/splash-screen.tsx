'use client';

import Box, { BoxProps } from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';

import { Logo } from '../logo';

// ----------------------------------------------------------------------
interface Props extends BoxProps {
  variant?: 'tv' | 'desktop' | 'mobile';
}
export function SplashScreen({ sx, variant = 'desktop', ...other }: Props) {
  const sizeLogo = variant === 'tv' ? '25vw' : 64;
  const insideDdge = variant === 'tv' ? '35vw' : 100;
  const outsideEdge = variant === 'tv' ? '35vw' : 120;

  return (
    <Box
      sx={{
        right: 0,
        width: 1,
        bottom: 0,
        height: 1,
        zIndex: 9998,
        display: 'flex',
        position: 'fixed',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        ...sx,
      }}
      {...other}
    >
      <>
        <m.div
          animate={{
            scale: [1, 0.9, 0.9, 1, 1],
            opacity: [1, 0.48, 0.48, 1, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeatDelay: 1,
            repeat: Infinity,
          }}
        >
          <Logo disabledLink sx={{ width: sizeLogo, height: sizeLogo }} />
        </m.div>

        <Box
          component={m.div}
          animate={{
            scale: [1.6, 1, 1, 1.6, 1.6],
            rotate: [270, 0, 0, 270, 270],
            opacity: [0.25, 1, 1, 1, 0.25],
            borderRadius: ['25%', '25%', '50%', '50%', '25%'],
          }}
          transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
          sx={{
            width: insideDdge,
            height: insideDdge,
            position: 'absolute',
            border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
          }}
        />

        <Box
          component={m.div}
          animate={{
            scale: [1, 1.2, 1.2, 1, 1],
            rotate: [0, 270, 270, 0, 0],
            opacity: [1, 0.25, 0.25, 0.25, 1],
            borderRadius: ['25%', '25%', '50%', '50%', '25%'],
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity,
          }}
          sx={{
            width: outsideEdge,
            height: outsideEdge,
            position: 'absolute',
            border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
          }}
        />
      </>
    </Box>
  );
}
