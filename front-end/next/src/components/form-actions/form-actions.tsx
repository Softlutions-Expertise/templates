'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/routes';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { findTabWithError } from '@softlutions/utils';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface TabConfig {
  value: string;
  label: string;
  icon: JSX.Element;
  disabled?: boolean;
}

interface TabSchema {
  name: string;
  keys: any;
}

interface Props {
  tabs: TabConfig[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  finalizeForm: boolean;
  listPath: any;
  isEditMode?: boolean;
  tabSchemas?: TabSchema[];
  showBackButton?: boolean;
}

export function FormActions({
  tabs,
  currentTab,
  setCurrentTab,
  finalizeForm,
  listPath,
  isEditMode,
  tabSchemas,
  showBackButton = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { formState, trigger } = useFormContext();

  const isEdit = isEditMode !== undefined ? isEditMode : pathname.includes('/edit');

  const currentTabIndex = tabs.findIndex((tab) => tab.value === currentTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleBack = () => {
    if (isFirstTab) {
      router.push(listPath);
    } else {
      const previousTab = tabs[currentTabIndex - 1];
      setCurrentTab(previousTab.value);
    }
  };

  const handleNext = () => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      setCurrentTab(nextTab.value);
    }
  };

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0 && tabSchemas) {
      findTabWithError({
        tabSchemas,
        formState,
        setCurrentTab,
      });
    }
  }, [formState.errors, tabSchemas, setCurrentTab]);

  const handleSave = async (event: React.FormEvent) => {
    const isValid = await trigger();

    if (!isValid) {
      event.preventDefault();
      return;
    }
  };

  const shouldShowNext = !isLastTab;
  const shouldShowSave = isLastTab || isEdit;

  return (
    <Grid xs={12} mt={-3}>
      <Stack
        alignItems="flex-end"
        flexDirection="row"
        justifyContent="flex-end"
        sx={{ mt: 3, marginLeft: 'auto' }}
      >
        <Stack direction="row" spacing={2}>
          {showBackButton && (
            <Button variant="outlined" color="inherit" onClick={handleBack}>
              Voltar
            </Button>
          )}

          {shouldShowNext && (
            <Button variant="outlined" onClick={handleNext}>
              Próximo
            </Button>
          )}

          {shouldShowSave && (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={finalizeForm}
              onClick={handleSave}
            >
              Salvar
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Grid>
  );
}
