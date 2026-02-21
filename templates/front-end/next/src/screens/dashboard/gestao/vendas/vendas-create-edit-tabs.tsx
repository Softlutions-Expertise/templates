import { IVendasFinalizeForm, IVendasTabs, IVendasViewer } from '@/models';
import { Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { useState } from 'react';

import { VendasActions } from './components';
import { VENDAS_ENUMS } from './enums';
import { vendasResolver } from './resolver';
import { VendasFormItens } from './vendas-form-itens';
import { VendasFormVenda } from './vendas-form-venda';

// ----------------------------------------------------------------------

type Props = {
  currentData?: IVendasViewer;
  finalizeForm: IVendasFinalizeForm;
  setFinalizeForm: (value: IVendasFinalizeForm) => void;
};

export function VendasViwerTabs({ currentData, finalizeForm, setFinalizeForm }: Props) {
  const [currentTab, setCurrentTab] = useState<IVendasTabs>('venda');
  
  const methods = vendasResolver(currentData);
  
  const { watch } = methods;

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async () => {
  setFinalizeForm({ ...finalizeForm, load: true });
  });

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Tabs
          value={currentTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {VENDAS_ENUMS.TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
              disabled={
                tab.value === 'pagamento' && ['Autoatendimento', 'Caixa'].includes(watch('origem'))
              }
              onClick={() => setCurrentTab(tab.value as IVendasTabs)}
            />
          ))}
        </Tabs>

        {currentTab === 'venda' && <VendasFormVenda />}
        {currentTab === 'itens' && <VendasFormItens />}
        
        <VendasActions finalizeForm={finalizeForm} setFinalizeForm={setFinalizeForm} />
      </Grid>
    </RHFFormProvider>
  );
}
