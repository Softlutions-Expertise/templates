import { IRegraTributariaCreateUpdate } from "@/models";
import { useMemo } from "react";

// ----------------------------------------------------------------------

const informacoesGeraisDefaultValues = (currentData?: IRegraTributariaCreateUpdate) => ({
  id: Number(currentData?.id) || undefined,
  descricao: currentData?.descricao || '',
  codigoBeneficioFiscal: currentData?.codigoBeneficioFiscal || '',
  cfopSaida: currentData?.cfopSaida || '',
  icmsCstCsosn: currentData?.icmsCstCsosn || '',
  pisCst: currentData?.pisCst || '',
  cofinsCst: currentData?.cofinsCst || '',
  ibsCbsCst: currentData?.ibsCbsCst || '',
  porcentagemReducaoBaseCalculoIcms: currentData?.porcentagemReducaoBaseCalculoIcms ?? 0,
  porcentagemReducaoBaseCalculoPis: currentData?.porcentagemReducaoBaseCalculoPis ?? 0,
  porcentagemReducaoBaseCalculoCofins: currentData?.porcentagemReducaoBaseCalculoCofins ?? 0,
  porcentagemReducaoBaseCalculoIbsCbs: currentData?.porcentagemReducaoBaseCalculoIbsCbs ?? 0,
  aliquotaIcms: currentData?.aliquotaIcms ?? 0,
  aliquotaPis: currentData?.aliquotaPis ?? 0,
  aliquotaCofins: currentData?.aliquotaCofins ?? 0,
  aliquotaCbs: currentData?.aliquotaCbs ?? 0,
  aliquotaIbsUF: currentData?.aliquotaIbsUF ?? 0,
  aliquotaIbsMun: currentData?.aliquotaIbsMun ?? 0,
  codigoClassTrib: currentData?.codigoClassTrib || '',
  ncm: currentData?.ncm || [],
});

export const regraTributariaDefaultValues = (currentData?: IRegraTributariaCreateUpdate) => {
  return useMemo(() => {
    return {
      ...informacoesGeraisDefaultValues(currentData),
    };
  }, [currentData]);
};
