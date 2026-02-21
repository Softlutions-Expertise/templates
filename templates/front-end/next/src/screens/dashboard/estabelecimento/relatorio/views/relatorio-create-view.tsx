'use client';

import { Breadcrumbs } from '@/components';
import { TRelatorioTypeForm } from '@/models';
import { pages } from '@/routes';
import { RelatorioExemploForm } from '../components/relatorio-exemplo-form';
import { RELATORIO_ENUMS } from '../enums';
import { RelatorioCreateEditForm } from '../relatorio-create-edit-form';

// ----------------------------------------------------------------------

export interface IRelatorioType {
  typeForm: TRelatorioTypeForm;
}

type FormComponent = React.ComponentType<IRelatorioType>;

export function RelatorioCreateView({ typeForm }: IRelatorioType) {
  const FORM_REGISTRY: Partial<Record<TRelatorioTypeForm, FormComponent>> = {
    exemplo: RelatorioExemploForm,
  };

  const FormByType = FORM_REGISTRY[typeForm] ?? RelatorioCreateEditForm;

  return (
    <>
      <Breadcrumbs
        heading="Emissão de relatórios"
        links={[
          { name: 'Painel', href: pages.dashboard.root.path },
          { name: 'Relatório' },
          { name: RELATORIO_ENUMS.NOME[typeForm] },
        ]}
      />
      <FormByType typeForm={typeForm} />
    </>
  );
}
