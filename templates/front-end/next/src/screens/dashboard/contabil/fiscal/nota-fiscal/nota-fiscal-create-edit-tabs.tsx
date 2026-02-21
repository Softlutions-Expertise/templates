'use client';

import { Tabs } from '@/components';
import {
  IFiscalContext,
  INotaFiscalCreateUpdate,
  INotaFiscalFinalizeForm,
  INotaFiscalTransmitir,
  TNotaFiscalTabs,
} from '@/models';
import { useRouter, useSearchParams } from '@/routes';
import { fiscalService } from '@/services';
import { Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFFormProvider } from '@softlutions/components';
import { fNumber } from '@softlutions/utils';
import { useEffect, useState } from 'react';

import { NotaFiscalActions, NotaFiscalExibicaoGeral } from './components';
import { NOTA_FISCAL_ENUM } from './enums';
import { NotaFiscalFormDestinatario } from './nota-fiscal-form-destinatario';
import { NotaFiscalFormEmitente } from './nota-fiscal-form-emitente';
import { NotaFiscalFormLogistica } from './nota-fiscal-form-logistica';
import { NotaFiscalFormMercadorias } from './nota-fiscal-form-mercadorias';
import { NotaFiscalFormPagamentos } from './nota-fiscal-form-pagamentos';
import { FormProcesso } from './nota-fiscal-form-processo';
import { NotaFiscalFormProtocolo } from './nota-fiscal-form-protocolo';
import { NotaFiscalFormReferencias } from './nota-fiscal-form-referencias';
import { notaFiscalResolver } from './resolver';

// ----------------------------------------------------------------------

interface Props {
  currentData?: INotaFiscalCreateUpdate;
  setValues: (value: any) => void;
  finalizeForm: INotaFiscalFinalizeForm;
  setFinalizeForm: (value: INotaFiscalFinalizeForm) => void;
  responseApi?: INotaFiscalTransmitir;
}

export function NotaFiscalCreateEditTabs({
  currentData,
  setValues,
  finalizeForm,
  setFinalizeForm,
  responseApi,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = (() => {
    const urlTab = searchParams.get('tab') as TNotaFiscalTabs;
    if (urlTab) {
      const validTab = NOTA_FISCAL_ENUM.FORM_TABS.find(
        (tab) => tab.value === urlTab && !tab.disabled,
      );
      return validTab ? urlTab : 'emitente';
    }
    return 'emitente';
  })();

  const [currentTab, setCurrentTab] = useState<TNotaFiscalTabs>(initialTab);
  const [context, setContext] = useState<IFiscalContext>({} as IFiscalContext);

  const methods = notaFiscalResolver(currentData);

  const { setValue, watch } = methods;
  const values: INotaFiscalCreateUpdate = watch() as INotaFiscalCreateUpdate;

  const updateTabInUrl = (tab: TNotaFiscalTabs) => {
    const url = new URL(window.location.href);
    const currentUrlTab = url.searchParams.get('tab');

    if (currentUrlTab !== tab) {
      url.searchParams.set('tab', tab);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  };

  const handleTabChange = (tab: TNotaFiscalTabs) => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
      updateTabInUrl(tab);
    }
  };

  const onSubmit = async (data: INotaFiscalCreateUpdate) => {
    setValues(data);
    setFinalizeForm({ ...finalizeForm, load: true });
  };

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (!urlTab) {
      updateTabInUrl(currentTab);
    }
  }, []);

  useEffect(() => {
    const urlTab = searchParams.get('tab') as TNotaFiscalTabs;
    if (urlTab && urlTab !== currentTab) {
      const validTab = NOTA_FISCAL_ENUM.FORM_TABS.find(
        (tab) => tab.value === urlTab && !tab.disabled,
      );
      if (validTab) {
        setCurrentTab(urlTab);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const mapeamentos = [
      { campo: 'valorTotalMercadorias', propriedade: 'valorTotal' },
      { campo: 'valorTotalBaseCalculoIcms', propriedade: 'valorBaseCalculoIcms' },
      { campo: 'valorTotalIcms', propriedade: 'valorIcms' },
      { campo: 'valorTotalDesconto', propriedade: 'valorDesconto' },
      { campo: 'valorTotalFrete', propriedade: 'valorFrete' },
      { campo: 'valorTotalSeguro', propriedade: 'valorSeguro' },
      { campo: 'valorTotalOutrasDespesas', propriedade: 'valorOutras' },
      { campo: 'valorTotalPis', propriedade: 'valorPis' },
      { campo: 'valorTotalCofins', propriedade: 'valorCofins' },
      { campo: 'valorTotalIpiDevolvido', propriedade: 'valorIpiDevolvido' },
      { campo: 'valorTotalBaseCalculoIbsCbs', propriedade: 'valorBaseCalculoIbsCbs' },
      { campo: 'valorTotalIbsUf', propriedade: 'valorIbsUf' },
      { campo: 'valorTotalIbsMun', propriedade: 'valorIbsMun' },
      { campo: 'valorTotalCbs', propriedade: 'valorCbs' },
    ];

    mapeamentos.forEach(({ campo, propriedade }) => {
      const total =
        values.itens
          ?.filter((item) => !item.deletar)
          ?.reduce((acc, item) => {
            const valorItem = Number(fNumber('float', (item as any)[propriedade] || 0));
            return acc + valorItem;
          }, 0) || 0;
      setValue(campo as any, total);
    });
  }, [values?.itens]);

  useEffect(() => {
    const tributos = [
      values?.valorTotalIcms,
      values?.valorTotalPis,
      values?.valorTotalCofins,
      values?.valorTotalIpiDevolvido,
    ];
    const valorTotalTributos = tributos.reduce((acc, val) => acc + Number(fNumber('float',val || 0)),0);
    setValue('valorTotalTributos' as any, Number(valorTotalTributos.toFixed(2)));
  }, [
    values?.valorTotalIcms,
    values?.valorTotalPis,
    values?.valorTotalCofins,
    values?.valorTotalIpiDevolvido,
  ]);

  useEffect(() => {
    if (
      values?.valorTotalMercadorias ||
      values?.valorTotalFrete ||
      values?.valorTotalSeguro ||
      values?.valorTotalOutrasDespesas ||
      values?.valorTotalDesconto
    ) {
      let valorTotal =
        Number(values?.modalidadeFrete) === 0 ? Number(values?.valorTotalFrete || 0) : 0;
      ['valorTotalMercadorias', 'valorTotalSeguro', 'valorTotalOutrasDespesas'].forEach(
        (key) => (valorTotal += Number(fNumber('float', (values as any)?.[key] || 0))),
      );
      
      valorTotal -= Number(fNumber('float', values?.valorTotalDesconto || 0));

      setValue('valorTotalNota', valorTotal);
    }
  }, [
    values?.valorTotalMercadorias,
    values?.valorTotalFrete,
    values?.modalidadeFrete,
    values?.valorTotalSeguro,
    values?.valorTotalOutrasDespesas,
    values?.valorTotalDesconto,
  ]);

  useEffect(() => {
    if (responseApi) {
      setValue('status', responseApi?.status?.descricao);
      setValue('dataHoraEmissao', responseApi?.dataHoraEmissao);
      setValue('dataHoraSaidaEntrada', responseApi?.dataHoraSaidaEntrada);
      setValue('envios', [...(values?.envios as any), responseApi?.envio]);
    }
  }, [responseApi]);

  useEffect(() => {
    fiscalService.context().then((response) => {
      setContext(response);
      
      const isEntrada = currentData?.tipoMovimento?.cod === 0;
      const isEdit = !!currentData?.id;
      
      if (!isEdit || !isEntrada) {
        setValue('emitenteNome', response.emitente.razaoSocial || '');
        setValue('emitenteTelefone', response.emitente.telefone || '');
        setValue('emitenteCpfCnpj', response.emitente.cnpj || '');
        setValue('emitenteInscricaoEstadual', response.emitente.inscricaoEstadual ?? '');
        setValue('emitenteEnderecoCep', response.emitente.enderecoCep);
        setValue('emitenteEnderecoEstado', response.emitente.enderecoEstado ?? '');
        setValue('emitenteEnderecoCidadeIbge', response.emitente.enderecoCidadeIbge ?? '');
        setValue('emitenteEnderecoCidade', response.emitente.enderecoCidade || '');
        setValue('emitenteEnderecoLogradouro', response.emitente.enderecoLogradouro || '');
        setValue('emitenteEnderecoBairro', response.emitente.enderecoBairro || '');
        setValue('emitenteEnderecoNumero', response.emitente.enderecoNumero || '');
        setValue('emitenteEnderecoComplemento', response.emitente.enderecoComplemento || '');
        setValue('emitenteNomePais', response.nomePais ?? '');
        setValue('emitenteCodigoPais', response.codigoPais || '');
      }
    });
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <NotaFiscalExibicaoGeral />
        <NotaFiscalActions
          finalizeForm={finalizeForm}
          setFinalizeForm={setFinalizeForm}
          currentData={currentData}
        />
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Grid container spacing={3}>
        <Grid xs={12} ml={-1}>
          <Tabs
            currentTab={currentTab}
            setCurrentTab={handleTabChange}
            tabs={NOTA_FISCAL_ENUM.FORM_TABS}
          />
        </Grid>
        {currentTab === 'emitente' && <NotaFiscalFormEmitente />}

        {currentTab === 'destinatario' && <NotaFiscalFormDestinatario context={context} />}

        {currentTab === 'processo' && <FormProcesso context={context} />}

        {currentTab === 'mercadorias' && <NotaFiscalFormMercadorias context={context} />}

        {currentTab === 'logistica' && <NotaFiscalFormLogistica context={context} />}

        {currentTab === 'referencias' && <NotaFiscalFormReferencias />}

        {currentTab === 'pagamentos' && <NotaFiscalFormPagamentos context={context} />}

        {currentTab === 'protocolo' && <NotaFiscalFormProtocolo />}
      </Grid>
    </RHFFormProvider>
  );
}
