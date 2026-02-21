import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-quill/dist/quill.snow.css';
import 'simplebar-react/dist/simplebar.min.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import 'src/theme/css.css';
import 'src/theme/locales/i18n';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

import { AuthConsumer, AuthProvider } from '@/context';
import ThemeProvider from '@/theme';

// ----------------------------------------------------------------------

import MotionLazy from '@/components/animate/motion-lazy';
import ProgressBar from '@/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from '@/components/settings';
import { SnackbarProvider } from '@/components/snackbar';
import { LocalizationProvider } from '@/theme/locales';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Cinelaser',
  description: 'Sistema para controle e gerenciamento do melhor cinema do Brasil',
  keywords: 'cinelaser,fiscal',
  themeColor: '#000000',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/assets/logo/logo_single.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/assets/logo/logo_single.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/assets/logo/logo_single.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/assets/logo/logo_single.png',
    },
  ],
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <LocalizationProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'dark', // 'light' | 'v'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'red', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: true,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SnackbarProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    <AuthConsumer>{children}</AuthConsumer>
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
