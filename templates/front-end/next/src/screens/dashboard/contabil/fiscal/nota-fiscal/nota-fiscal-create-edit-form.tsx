'use client';

import {
  IFiscalMercadoria,
  IFiscalPagamentos,
  INotaFiscalCreateUpdate,
  INotaFiscalFinalizeForm,
  INotaFiscalTransmitir,
} from '@/models';
import { pages, useRouter } from '@/routes';
import { notaFiscalService } from '@/services';
import { useError } from '@softlutions/hooks';
import { fNumber } from '@softlutions/utils';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { NOTA_FISCAL_ENUM } from './enums';
import { NotaFiscalCreateEditTabs } from './nota-fiscal-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: INotaFiscalCreateUpdate;
}

export function NotaFiscalCreateEditForm({ currentData }: Props) {
  const handleError = useError();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [responseApi, setResponseApi] = useState<INotaFiscalTransmitir>();

  const [finalizeForm, setFinalizeForm] = useState<INotaFiscalFinalizeForm>(
    NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM,
  );

  const [values, setValues] = useState<INotaFiscalCreateUpdate>();

  const handleCreate = async (data: INotaFiscalCreateUpdate) => {
    notaFiscalService
      .create(data)
      .then((response) => {
        enqueueSnackbar('Salvo com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.notaFiscal.edit.path(response.id));
      })
      .catch((error) => handleError(error))
      .finally(() => setFinalizeForm(NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleUpdate = async (data: INotaFiscalCreateUpdate) => {
    notaFiscalService
      .update({ ...data, id: Number(currentData?.id) })
      .then(() => enqueueSnackbar('Salvo com sucesso!'))
      .catch((error) => handleError(error))
      .finally(() => setFinalizeForm(NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleExcluir = async (id: number) => {
    notaFiscalService
      .remove(id)
      .then(() => {
        enqueueSnackbar('Excluido com sucesso!');
        router.push(pages.dashboard.contabil.fiscal.notaFiscal.list.path);
      })
      .catch((error) => handleError(error))
      .finally(() => setFinalizeForm(NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleTransmitir = async (id: number) => {
    notaFiscalService
      .transmitir(id)
      .then((response) => {
        enqueueSnackbar(response.motivo);
        setResponseApi(response);
      })
      .catch((error) => handleError(error))
      .finally(() => setFinalizeForm(NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleDanfe = async (id: number) => {
    notaFiscalService
      .danfe(id)
      .then(() => enqueueSnackbar('Baixado com sucesso!'))
      .catch((error) => handleError(error))
      .finally(() => setFinalizeForm(NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const handleXmlAutorizado = async (id: number) => {
    notaFiscalService
      .xmlAutorizado(id)
      .then(() => enqueueSnackbar('XML baixado com sucesso!'))
      .catch((error) => handleError(error))
      .finally(() => setFinalizeForm(NOTA_FISCAL_ENUM.DEFAULT_FINALIZE_FORM));
  };

  const clearingShippingData = (data: any) => {
    delete data?.envios;
    delete data?.contingencia;
    delete data?.status;
    delete data?.justificativaContingencia;
    delete data?.numero;
    delete data?.dataHoraEmissao;
    delete data?.dataHoraSaidaEntrada;

    const setEmptyToNull = (data: any) => {
      for (const key in data)
        if (['', null, undefined, {}, [], ``].includes(data[key])) data[key] = null;
      return data;
    };

    if (data?.entregaMesmoEnderecoDestinatario) {
      for (const key in data) {
        if (['entrega'].includes(key) && key !== 'entregaMesmoEnderecoDestinatario')
          delete data[key];
      }
    }

    [
      'volumePesoBruto',
      'volumePesoLiquido',
      'valorTotalBaseCalculoIcms',
      'valorTotalIcms',
      'valorTotalMercadorias',
      'valorTotalFrete',
      'valorTotalSeguro',
      'valorTotalOutrasDespesas',
      'valorTotalDesconto',
      'valorTotalNota',
      'valorTotalPis',
      'valorTotalCofins',
      'valorTotalIpiDevolvido',
      'valorTotalTributos',
      'volumeQuantidade',
    ].forEach((key) => {
      data[key] = fNumber('float', data[key]);
    });

    data.itens = data.itens.map((item: IFiscalMercadoria) => ({
      ...item,
      unidadeMedida: item.unidadeMedida?.cod || item.unidadeMedida,
    }));

    data.pagamentos = data.pagamentos.map((item: IFiscalPagamentos) => ({
      ...item,
      formaPagamento: item?.formaPagamento?.cod || item?.formaPagamento,
      tipoPagamento: item?.tipoPagamento?.cod || item?.tipoPagamento,
      card:
        item?.card?.tipoIntegracao?.cod || item?.card?.tipoIntegracao
          ? {
              ...item.card,
              tipoIntegracao: item.card?.tipoIntegracao?.cod || item.card?.tipoIntegracao,
              bandeiraCartao: item.card?.bandeiraCartao?.cod || item.card?.bandeiraCartao,
            }
          : null,
    }));

    if (data?.chaveAcessoReferenciada.length > 0) {
      data.chaveAcessoReferenciada = data.chaveAcessoReferenciada.map(
        (item: string) => item?.replace(/[^a-zA-Z0-9]/g, ''),
      );
    }

    return setEmptyToNull(data);
  };

  useEffect(() => {
    if (finalizeForm.load) {
      switch (finalizeForm.type) {
        case 'salvar':
          const data = clearingShippingData(values);
          !currentData ? handleCreate(data) : handleUpdate(data);
          break;
        case 'excluir':
          handleExcluir(Number(currentData?.id));
          break;
        case 'transmitir':
          handleTransmitir(Number(currentData?.id));
          break;
        case 'danfe':
          handleDanfe(Number(currentData?.id));
          break;
        case 'xmlAutorizado':
          handleXmlAutorizado(Number(currentData?.id));
          break;
      }
    }
  }, [finalizeForm.load]);

  return (
    <NotaFiscalCreateEditTabs
      currentData={values || currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
      responseApi={responseApi}
    />
  );
}
