import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@theme/index';
import { AuthProvider } from '@context/auth/auth-context';

const inter = Inter({ subsets: ['latin'] });

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Controle de Despesas Pessoais',
};

// ----------------------------------------------------------------------

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
