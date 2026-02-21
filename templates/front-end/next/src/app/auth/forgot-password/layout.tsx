'use client';

import { GuestGuard } from '@/components';
import { CompactLayout } from '@/layouts';

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <CompactLayout>{children}</CompactLayout>
    </GuestGuard>
  );
}
