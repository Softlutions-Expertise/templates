'use client';

import { ExampleEditView } from '@/screens/dashboard/example/views';
import { useParams } from '@/routes';

// ----------------------------------------------------------------------

export default function ExampleEditPage() {
  const { id } = useParams();
  
  return <ExampleEditView id={id as string} />;
}
