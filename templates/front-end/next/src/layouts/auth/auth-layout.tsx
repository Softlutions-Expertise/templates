import { Logo } from '@/components';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useResponsive } from '@softlutions/hooks';

import { useSettingsContext } from '@/components/settings';
import { bgGradient } from '@/theme/css';

// ----------------------------------------------------------------------

interface Props {
  title?: string;
  image?: string;
  children: React.ReactNode;
}

export function AuthLayout({ children, image, title }: Props) {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');

  const { themeMode } = useSettingsContext();

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={10}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94,
          ),
          imgUrl: '/assets/images/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'Olá, bem-vindo novamente'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || `/assets/logo/logo_full_${themeMode}.png`}
        sx={{ maxWidth: 720 }}
      />

      <Stack direction="row" spacing={2}></Stack>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}
