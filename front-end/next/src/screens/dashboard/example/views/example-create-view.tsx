'use client';

import { useCallback } from 'react';
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Iconify } from '@/components';
import { CustomBreadcrumbs, useSettingsContext } from '@/components';
import FormProvider, { RHFTextField, RHFSelect } from '@/components/hook-form';
import { pages, useRouter } from '@/routes';
import { IExampleCreate } from '@/models';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: Yup.string().required('Telefone é obrigatório'),
  document: Yup.string().required('Documento é obrigatório'),
  status: Yup.string().required('Status é obrigatório'),
});

// ----------------------------------------------------------------------

export function ExampleCreateView() {
  const settings = useSettingsContext();
  const router = useRouter();

  const defaultValues: IExampleCreate = {
    name: '',
    email: '',
    phone: '',
    document: '',
    status: 'active',
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(async (data: IExampleCreate) => {
    console.log('Dados enviados:', data);
    // Aqui você chamaria o serviço
    // await exampleService.create(data);
    router.push(pages.dashboard.example.list.path);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Criar Cliente"
        links={[
          { name: 'Dashboard', href: pages.dashboard.root.path },
          { name: 'Clientes', href: pages.dashboard.example.list.path },
          { name: 'Criar' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Informações do Cliente</Typography>

            <Box
              display="grid"
              gap={3}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Nome completo" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phone" label="Telefone" />
              <RHFTextField name="document" label="CPF/CNPJ" />
              <RHFSelect native name="status" label="Status">
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.push(pages.dashboard.example.list.path)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Iconify icon="mingcute:check-line" />}
                loading={isSubmitting}
              >
                Salvar
              </Button>
            </Stack>
          </Stack>
        </Card>
      </FormProvider>
    </Container>
  );
}
