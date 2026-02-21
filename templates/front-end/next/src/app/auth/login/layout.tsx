'use client';

import { GuestGuard } from '@/components';
import { AuthLayout } from '@/layouts';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
