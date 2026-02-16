'use client';

import { pages, useRouter } from '@/routes';

// ----------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();

  return router.push(pages.dashboard.root.path);
}
