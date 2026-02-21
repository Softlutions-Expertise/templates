import { IColaborador, IColaboradorShow } from '@/models';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const informacoesGerais = (currentData?: IColaborador | IColaboradorShow) => {
  const perfilValue = currentData?.perfil 
    ? typeof currentData.perfil === 'object' 
      ? currentData.perfil.cod 
      : Number(currentData.perfil)
    : '';

  return {
    nome: currentData?.nome || '',
    username: currentData?.username || '',
    perfil: perfilValue,
    bloqueado: currentData?.bloqueado ?? false,
    updatePassword: currentData?.updatePassword ?? false,
  };
};

export const colaboradorDefaultValues = (currentData?: IColaborador | IColaboradorShow) => {
  return useMemo(() => {
    return {
      ...informacoesGerais(currentData),
    };
  }, [currentData]);
};
