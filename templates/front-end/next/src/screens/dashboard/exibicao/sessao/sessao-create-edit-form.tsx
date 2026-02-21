'use client';

import { ISessaoCreate, ISessaoEdit } from '@/models';
import { pages, useRouter } from '@/routes';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { sessaoService } from '@/services';
import { SessaoEditTabs } from './sessao-create-edit-tabs';

// ----------------------------------------------------------------------

interface Props {
  currentData?: ISessaoEdit;
}

export function SessaoCreateEditForm({ currentData }: Props) {
  const handleError = useError();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [finalizeForm, setFinalizeForm] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});

  const handleCreate = async (data: ISessaoCreate) => {
    sessaoService
      .create(data)
      .then(() => {
        enqueueSnackbar('Sessão criada com sucesso!');
        router.push(pages.dashboard.exibicao.sessao.list.path);
      })
      .catch((error: any) => handleError(error, 'Erro ao criar sessão!'))
      .finally(() => setFinalizeForm(false));
  };

  const handleUpdate = async (data: ISessaoEdit) => {
    if (!currentData?.id) return;
    
    sessaoService
      .update(currentData.id, data)
      .then(() => {
        enqueueSnackbar('Sessão atualizada com sucesso!');
        router.push(pages.dashboard.exibicao.sessao.list.path);
      })
      .catch((error) => handleError(error, 'Erro ao atualizar sessão!'))
      .finally(() => setFinalizeForm(false));
  };

  const formatEditData = (data: any): ISessaoEdit => {
    const payload: ISessaoEdit = {
      sala: typeof data.sala === 'object' ? data.sala.id : data.sala,
      salaRendas: data.salaRendas && typeof data.salaRendas === 'object' ? data.salaRendas.id : data.salaRendas,
      filme: typeof data.filme === 'object' ? data.filme.id || data.filme.cod : data.filme,
      data: data.data,
      hora: data.hora?.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1:$2') || data.hora,
      tipoProjecao: data.tipoProjecao,
      idiomaExibicao: data.idiomaExibicao,
      resolucao4k: data.resolucao4k,
      tipoSessao: data.tipoSessao,
      atmos: data.atmos,
      libras: data.libras,
      legendaDescritiva: data.legendaDescritiva,
      audioDescricao: data.audioDescricao,
      venderPdv: data.venderPdv,
      venderWeb: data.venderWeb,
      venderAtm: data.venderAtm,
    };

    if (data.valoresPadrao && Object.keys(data.valoresPadrao).length > 0) {
      payload.valoresPadrao = data.valoresPadrao;
    }
    if (data.valoresPromocao && Object.keys(data.valoresPromocao).length > 0) {
      payload.valoresPromocao = data.valoresPromocao;
    }

    return payload;
  };

  const formatCreateData = (data: any): ISessaoCreate => {
    const horarios = (data.horarios || []).filter((h: any) => h.habilitar !== false).map((h: any) => {
      const { habilitar, deletar, id, ...rest } = h;

      return {
        sala: typeof rest.sala === 'object' ? rest.sala.id : rest.sala,
        hora: rest.hora?.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1:$2') || rest.hora,
        tipoSessao: rest.tipoSessao,
        tipoProjecao: rest.tipoProjecao,
        idiomaExibicao: rest.idiomaExibicao,
        resolucao4k: rest.resolucao4k,
        atmos: rest.atmos,
        libras: rest.libras,
        legendaDescritiva: rest.legendaDescritiva,
        audioDescricao: rest.audioDescricao,
        valoresPadrao: rest.valoresPadrao && Object.keys(rest.valoresPadrao).length > 0 ? rest.valoresPadrao : {},
        valoresPromocao: rest.valoresPromocao && Object.keys(rest.valoresPromocao).length > 0 ? rest.valoresPromocao : undefined,
      };
    });

    return {
      filme: typeof data.filme === 'object' ? data.filme.id || data.filme.cod : data.filme,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      horarios,
    };
  };

  useEffect(() => {
    if (finalizeForm) {
      if (currentData) {
        const data = formatEditData(values);
        handleUpdate(data);
      } else {
        const data = formatCreateData(values);
        handleCreate(data);
      }
    }
  }, [finalizeForm]);

  return (
    <SessaoEditTabs
      currentData={currentData}
      setValues={setValues}
      finalizeForm={finalizeForm}
      setFinalizeForm={setFinalizeForm}
    />
  );
}
