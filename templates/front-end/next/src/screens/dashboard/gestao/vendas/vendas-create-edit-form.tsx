'use client';

import { IVendasFinalizeForm, IVendasViewer } from '@/models';
import { useState } from 'react';

import { VENDAS_ENUMS } from './enums';
import { VendasViwerTabs } from './vendas-create-edit-tabs';

// ----------------------------------------------------------------------

type Props = {
  currentData?: IVendasViewer;
};

export default function VendasViewerForm({ currentData }: Props) {
  const [finalizeForm, setFinalizeForm] = useState<IVendasFinalizeForm>(
    VENDAS_ENUMS.DEFAULTFINALIZEFORM,
  );

  return (
    <>
      <VendasViwerTabs
        currentData={currentData}
        finalizeForm={finalizeForm}
        setFinalizeForm={setFinalizeForm}
      />
    </>
  );
}
