'use client';

import { Iconify } from '@/components';
import { Badge, IconButton } from '@mui/material';
import { badgeClasses } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { m } from 'framer-motion';

import { varHover } from '@/components/animate';
import { useSettingsContext } from '@/components/settings';

// ----------------------------------------------------------------------

interface Props {
  sx?: SxProps<Theme>;
}

export function SettingsButton({ sx }: Props) {
  const settings = useSettingsContext();

  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!settings.canReset}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
        },
        ...sx,
      }}
    >
      <Box
        component={m.div}
        animate={{
          rotate: [0, settings.open ? 0 : 360],
        }}
        transition={{
          duration: 12,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          aria-label="settings"
          onClick={settings.onToggle}
          sx={{
            width: 40,
            height: 40,
          }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={24} />
        </IconButton>
      </Box>
    </Badge>
  );
}
