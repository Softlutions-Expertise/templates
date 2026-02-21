import { RHFAutocomplete, RHFFormProvider, RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';
import { RHFTextFieldCustom } from '@/components';
import { useEffect, useMemo, useState } from 'react';

import { IFiscalContext, IFiscalMercadoria } from '@/models';
import { fiscalService } from '@/services';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useError } from '@softlutions/hooks';
import { fNumber, yup } from '@softlutions/utils';
import { useForm, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------
interface Props {
  context: IFiscalContext;
}

export function NotaFiscalDialogMercadoriaCreateEditForm({ context }: Props) {
  const handleError = useError();

  const { setValue: setValueList, watch: watchList } = useFormContext();
  const { currentRow, dataTable } = watchList();

  if (!currentRow?.renderForm) return null;

  const [activateForm, setActivateForm] = useState<boolean>(false);

  const [listaMercadorias, setListaMercadorias] = useState<IFiscalMercadoria[]>([]);

  const validationSchema = yup.object().shape({
    searchMercadoria: yup.mixed().nullable(),
    id: yup.number().required('Código'),
    descricao: yup.string().required('Descrição é obrigatória'),
    unidadeMedida: yup.number().required('Unidade de medida'),
    ncm: yup.string().required('NCM é obrigatória'),
    codigoBarras: yup.string(),
    cest: yup.string(),
    codigoBeneficioFiscal: yup.string(),
    cfopSaida: yup.string().test('cfop', 'CFOP de saída é obrigatória', function (value) {
      if (!value) {
        return false;
      }
      return true;
    }),
    informacaoAdicional: yup.string(),
    porcentagemBaseCalculoIcms: yup.number().required('BC ICMS'),
    valorBaseCalculoIcms: yup.number().required('Valor da BC ICMS'),
    modalidadeBc: yup.string().optional(),
    calculoAutomaticoIcms: yup.boolean(),
    icmsCstCsosn: yup.string(),
    valorBaseCalculoStRet: yup.number().optional(),
    aliquotaSt: yup.number().optional(),
    valorIcmsStRetido: yup.number().optional(),
    valorIcmsProprioSubstituto: yup.number().optional(),
    calculoAutomaticoPis: yup.boolean(),
    pisCst: yup.string().required('PIS CST é obrigatória'),
    valorBaseCalculoPis: yup.number().optional(),
    aliquotaPis: yup.number().optional(),
    valorPis: yup.number().optional(),
    calculoAutomaticoCofins: yup.boolean(),
    cofinsCst: yup.string().required('CONFINS CST é obrigatória'),
    valorBaseCalculoCofins: yup.number().optional(),
    aliquotaCofins: yup.number().optional(),
    valorCofins: yup.number().optional(),
    calculoAutomaticoIbsCbs: yup.boolean(),
    ibsCbsCst: yup.string().optional(),
    codigoClassTrib: yup.string().optional(),
    porcentagemBaseCalculoIbsCbs: yup.number().optional(),
    valorBaseCalculoIbsCbs: yup.number().optional(),
    aliquotaIbsUf: yup.number().optional(),
    aliquotaIbsMun: yup.number().optional(),
    aliquotaCbs: yup.number().optional(),
    valorCbs: yup.number().optional(),
    valorIbsUf: yup.number().optional(),
    valorIbsMun: yup.number().optional(),
    devolverIpi: yup.boolean(),
    porcentagemIpiDevolvido: yup.number().optional(),
    valorIpiDevolvido: yup.number().optional(),
    informacaoIpiDevolvido: yup.string(),
    valorDesconto: yup.number().required('Valor desconto'),
    valorSeguro: yup.number().optional(),
    valorFrete: yup.number().optional(),
    valorOutras: yup.number().optional(),
    ipiCst: yup.string(),
    quantidade: yup.number().required('Quantidade'),
    valorUnitario: yup.number().required('Valor unitário'),
    valorTotal: yup.number().required('Valor total'),
    aliquotaIcms: yup.number().required('Aliquota do ICMS'),
    modalidadeBcSt: yup.string().optional(),
    origemMercadoria: yup.string().optional(),
    valorIcms: yup.number().required('Valor do ICMS'),
    deletar: yup.boolean(),
  });

  const defaultValues = useMemo(() => {
    return {
      searchMercadoria: currentRow?.id ? currentRow : null,
      id: Number(currentRow?.id) || '',
      descricao: currentRow?.descricao || '',
      unidadeMedida: currentRow?.unidadeMedida?.cod ?? currentRow?.unidadeMedida ?? '',
      ncm: currentRow?.ncm || '',
      codigoBarras: currentRow?.codigoBarras || '',
      cest: currentRow?.cest || '',
      codigoBeneficioFiscal: currentRow?.codigoBeneficioFiscal || '',
      cfopSaida: currentRow?.cfopSaida || '',
      informacaoAdicional: currentRow?.informacaoAdicional || '',
      porcentagemBaseCalculoIcms: currentRow?.porcentagemBaseCalculoIcms ?? 0,
      valorBaseCalculoIcms: currentRow?.valorBaseCalculoIcms ?? 0,
      modalidadeBc: currentRow?.modalidadeBc || '',
      calculoAutomaticoIcms: currentRow?.calculoAutomaticoIcms ?? true,
      icmsCstCsosn: currentRow?.icmsCstCsosn || '',
      valorBaseCalculoStRet: currentRow?.valorBaseCalculoStRet ?? 0,
      aliquotaSt: currentRow?.aliquotaSt ?? 0,
      valorIcmsStRetido: currentRow?.valorIcmsStRetido ?? 0,
      valorIcmsProprioSubstituto: currentRow?.valorIcmsProprioSubstituto ?? 0,
      calculoAutomaticoPis: currentRow?.calculoAutomaticoPis ?? true,
      pisCst: currentRow?.pisCst || '',
      valorBaseCalculoPis: currentRow?.valorBaseCalculoPis ?? 0,
      aliquotaPis: currentRow?.aliquotaPis ?? 0,
      valorPis: currentRow?.valorPis ?? 0,
      calculoAutomaticoCofins: currentRow?.calculoAutomaticoCofins ?? true,
      cofinsCst: currentRow?.cofinsCst || '',
      valorBaseCalculoCofins: currentRow?.valorBaseCalculoCofins ?? 0,
      aliquotaCofins: currentRow?.aliquotaCofins ?? 0,
      valorCofins: currentRow?.valorCofins ?? 0,
      calculoAutomaticoIbsCbs: currentRow?.calculoAutomaticoIbsCbs ?? true,
      ibsCbsCst: currentRow?.ibsCbsCst || '',
      codigoClassTrib: currentRow?.codigoClassTrib || '',
      porcentagemBaseCalculoIbsCbs: currentRow?.porcentagemBaseCalculoIbsCbs ?? 0,
      valorBaseCalculoIbsCbs: currentRow?.valorBaseCalculoIbsCbs ?? 0,
      aliquotaIbsUf: currentRow?.aliquotaIbsUf ?? 0,
      aliquotaIbsMun: currentRow?.aliquotaIbsMun ?? 0,
      aliquotaCbs: currentRow?.aliquotaCbs ?? 0,
      valorCbs: currentRow?.valorCbs ?? 0,
      valorIbsUf: currentRow?.valorIbsUf ?? 0,
      valorIbsMun: currentRow?.valorIbsMun ?? 0,
      devolverIpi: currentRow?.devolverIpi ?? false,
      porcentagemIpiDevolvido: currentRow?.porcentagemIpiDevolvido ?? 0,
      valorIpiDevolvido: currentRow?.valorIpiDevolvido ?? 0,
      informacaoIpiDevolvido: currentRow?.informacaoIpiDevolvido || '',
      valorDesconto: currentRow?.valorDesconto ?? 0,
      valorSeguro: currentRow?.valorSeguro ?? 0,
      valorFrete: currentRow?.valorFrete ?? 0,
      valorOutras: currentRow?.valorOutras ?? 0,
      ipiCst: currentRow?.ipiCst || '',
      quantidade: currentRow?.quantidade || '',
      valorUnitario: currentRow?.valorUnitario ?? 0,
      valorTotal: currentRow?.valorTotal ?? 0,
      aliquotaIcms: currentRow?.aliquotaIcms ?? 0,
      modalidadeBcSt: currentRow?.modalidadeBcSt || '',
      origemMercadoria: currentRow?.origemMercadoria || '',
      valorIcms: currentRow?.valorIcms ?? 0,
      deletar: currentRow?.deletar ?? false,
    };
  }, [currentRow]);

  const methods = useForm({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
  });

  const {
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = methods;

  const values = watch();

  const onSubmit = (data: any) => {
    ['modalidadeBc', 'modalidadeBcSt', 'origemMercadoria'].forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        data[key] = String(data[key]);
      }
    });
    data.deletar = false;
    delete data.searchMercadoria;

    !currentRow?.id ? handleCreat(data) : handleUpdate(data);
  };

  const handleCreat = (data: any) => {
    const index = dataTable.findIndex((item: IFiscalMercadoria) => item.id === data.id);
    if (index !== -1) {
      dataTable[index] = data;
      setValueList('dataTable', [...dataTable]);
      setValueList('currentRow', null);
      reset(defaultValues);
    } else {
      setValueList('dataTable', [...dataTable, data]);
      setValueList('currentRow', null);
      reset(defaultValues);
    }
  };

  const handleUpdate = (data: any) => {
    const index = dataTable.findIndex((item: IFiscalMercadoria) => item.id === data.id);
    dataTable[index] = data;
    setValueList('dataTable', [...dataTable]);
    setValueList('currentRow', null);
    reset(defaultValues);
  };

  const handleInputChange = (_: any, newInputValue: string) => {
    fiscalService
      .findAllMercadoria(newInputValue)
      .then((response) => setListaMercadorias(response))
      .catch((error) => handleError(error, 'Erro ao consultar mercadorias'));
  };

  const handleChange = (_: any, newValue: any) => {
    setValue(
      'searchMercadoria',
      ['', null, undefined].includes(newValue as any) ? null : newValue,
      {
        shouldValidate: true,
      },
    );
    if (newValue && !currentRow?.id) {
      Object.keys(newValue).map((key) => {
        let data = ['valorDesconto', 'valorIcms', 'valorBaseCalculoIcms', 'valorSaida'].includes(
          key,
        )
          ? fNumber('money', newValue[key] || 0)
          : newValue[key] || '';

        setValue((key === 'valorSaida' ? 'valorUnitario' : key) as any, data, {
          shouldValidate: true,
        });
      });
    } else {
      reset(defaultValues);
    }
  };

  useEffect(() => {
    if (values.valorUnitario && values.quantidade) {
      const result =
        Number(fNumber('float', values?.valorUnitario)) * Number(values?.quantidade || 0);

      setValue('valorTotal', result);
    }
  }, [values.valorUnitario, values.quantidade]);

  useEffect(() => {
    if (values?.calculoAutomaticoIcms) {
      const cst = values.icmsCstCsosn;
      const total = Number(fNumber('float', values.valorTotal || 0));

      let percent = 0;
      if (cst === '00') {
        // sempre 100% da base
        percent = 100;
      } else if (['20', '70', '90', '900'].includes(cst)) {
        // usa a % informada
        percent = values.porcentagemBaseCalculoIcms || 0;
      } else {
        // qualquer outro, tributa 0%
        percent = 0;
      }

      const base = (total * percent) / 100;
      setValue('valorBaseCalculoIcms', base);
    }
  }, [
    values?.icmsCstCsosn,
    values?.porcentagemBaseCalculoIcms,
    values?.valorTotal,
    values?.calculoAutomaticoIcms,
  ]);

  useEffect(() => {
    if (values?.calculoAutomaticoIcms) {
      const baseFloat = Number(fNumber('float', values.valorBaseCalculoIcms || 0));
      const aliqFloat = Number(fNumber('float', values.aliquotaIcms || 0));
      const icms = (baseFloat * aliqFloat) / 100;
      setValue('valorIcms', icms);
    }
  }, [values.valorBaseCalculoIcms, values.aliquotaIcms, values?.calculoAutomaticoIcms]);

  useEffect(() => {
    if (values?.calculoAutomaticoPis) {
      const baseFloat = Number(fNumber('float', values.valorBaseCalculoPis || 0));
      const aliqFloat = Number(fNumber('float', values.aliquotaPis || 0));
      const pis = (baseFloat * aliqFloat) / 100;
      setValue('valorPis', pis);
    }
  }, [values?.valorBaseCalculoPis, values?.aliquotaPis, values?.calculoAutomaticoPis]);

  useEffect(() => {
    if (values?.calculoAutomaticoCofins) {
      const baseFloat = Number(fNumber('float', values.valorBaseCalculoCofins || 0));
      const aliqFloat = Number(fNumber('float', values.aliquotaCofins || 0));
      const cofins = (baseFloat * aliqFloat) / 100;
      setValue('valorCofins', cofins);
    }
  }, [values?.valorBaseCalculoCofins, values?.aliquotaCofins, values?.calculoAutomaticoCofins]);

  useEffect(() => {
    if (values?.calculoAutomaticoIbsCbs) {
      const total = Number(fNumber('float', values.valorTotal || 0));
      const percent = values.porcentagemBaseCalculoIbsCbs || 0;
      const base = (total * percent) / 100;
      setValue('valorBaseCalculoIbsCbs', base);
    }
  }, [
    values?.porcentagemBaseCalculoIbsCbs,
    values?.valorTotal,
    values?.calculoAutomaticoIbsCbs,
  ]);

  useEffect(() => {
    if (values?.calculoAutomaticoIbsCbs) {
      const baseFloat = Number(fNumber('float', values.valorBaseCalculoIbsCbs || 0));
      const aliqIbsUf = Number(fNumber('float', values.aliquotaIbsUf || 0));
      const aliqIbsMun = Number(fNumber('float', values.aliquotaIbsMun || 0));
      const aliqCbs = Number(fNumber('float', values.aliquotaCbs || 0));
      
      const ibsUf = (baseFloat * aliqIbsUf) / 100;
      const ibsMun = (baseFloat * aliqIbsMun) / 100;
      const cbs = (baseFloat * aliqCbs) / 100;
      
      setValue('valorIbsUf', ibsUf);
      setValue('valorIbsMun', ibsMun);
      setValue('valorCbs', cbs);
    }
  }, [
    values?.valorBaseCalculoIbsCbs,
    values?.aliquotaIbsUf,
    values?.aliquotaIbsMun,
    values?.aliquotaCbs,
    values?.calculoAutomaticoIbsCbs,
  ]);

  useEffect(() => {
    fiscalService
      .findAllMercadoria()
      .then((response) => setListaMercadorias(response))
      .catch((error) => handleError(error, 'Erro ao consultar mercadorias'));
  }, []);

  useEffect(() => {
    if (currentRow) {
      reset(defaultValues);
    }
  }, [currentRow, reset, defaultValues]);

  const handleClose = () => {
    setValueList('currentRow', null);
    reset();
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={!!currentRow} onClose={handleClose}>
      <RHFFormProvider
        methods={methods}
        onSubmit={onSubmit}
        activateForm={activateForm}
        setActivateForm={setActivateForm}
      >
        <DialogContent dividers>
          <Grid container spacing={3} columnSpacing={2} mt={3}>
            <Grid xs={12}>
              <RHFAutocomplete
                fullWidth
                name="searchMercadoria"
                label="Buscar mercadoria"
                freeSolo
                disabled={!!currentRow?.id}
                options={listaMercadorias
                  .filter(
                    (item: any) =>
                      !dataTable.find(
                        (itemTable: any) =>
                          itemTable.id.toString() === item.id.toString() && !itemTable.deletar,
                      ),
                  )
                  ?.map((option) => option)}
                getOptionLabel={(option: any) => option?.descricao}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <a>
                      {option.id} - {option.descricao}
                    </a>
                  </li>
                )}
                onInputChange={handleInputChange}
                onChange={handleChange}
                noOptionsText="Nenhuma mercadoria encontrada"
              />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações gerais
              </Typography>
            </Grid>

            <Grid xs={12} md={1}>
              <RHFTextField size="small" name="id" label="Código" disabled />
            </Grid>
            <Grid xs={12} md={6.5}>
              <RHFTextField size="small" name="descricao" label="Descrição" />
            </Grid>
            <Grid xs={12} md={1.5}>
              <RHFTextField size="small" name="quantidade" label="Quantidade" mask="number" />
            </Grid>
            <Grid xs={12} md={1.5}>
              <RHFTextFieldCustom size="small" name="valorUnitario" label="Valor unitário" mask="money3" />
            </Grid>
            <Grid xs={12} md={1.5}>
              <RHFTextField
                size="small"
                name="valorTotal"
                label="Valor total produto"
                mask="money"
                disabled
              />
            </Grid>

            <Grid xs={12} md={2}>
              <RHFSelect size="small" name="unidadeMedida" label="Medida">
                {context?.unidadeMedida?.map((item) => (
                  <MenuItem key={item.cod} value={item.cod}>
                    {item.descricao}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid xs={12} md={1.75}>
              <RHFTextField size="small" name="codigoBarras" label="Cód. de Barras" />
            </Grid>
            <Grid xs={12} md={1.75}>
              <RHFTextField size="small" name="ncm" label="NCM" mask="numberZeroLeft" />
            </Grid>
            <Grid xs={12} md={1.75}>
              <RHFTextField size="small" name="cest" label="CEST" mask="numberZeroLeft" />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField size="small" name="cfopSaida" label="CFOP de Saída" mask="number" />
            </Grid>
            <Grid xs={12} md={2.75}>
              <RHFTextField
                size="small"
                name="codigoBeneficioFiscal"
                label="Cód. Benefício Fiscal"
              />
            </Grid>

            <Grid xs={12}>
              <RHFTextField size="small" name="informacaoAdicional" label="Informação Adicional" />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField size="small" name="valorDesconto" label="Valor desconto" mask="money" />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField size="small" name="valorSeguro" label="Valor Seguro" mask="money" />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField size="small" name="valorFrete" label="Valor Frete" mask="money" />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField size="small" name="valorOutras" label="Valor Outras" mask="money" />
            </Grid>

            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: -1 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Área ICMS
              </Typography>
              <RHFSwitch name="calculoAutomaticoIcms" label="Cálculo automático" />
            </Grid>

            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="icmsCstCsosn"
                label="ICMS CST / CSOSN"
                max={3}
                mask="numberZeroLeft"
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField size="small" name="modalidadeBc" label="Modalidade BC" />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="porcentagemBaseCalculoIcms"
                label="BC ICMS"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="valorBaseCalculoIcms"
                label="Valor BC ICMS"
                mask="money"
                disabled={values?.calculoAutomaticoIcms}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="aliquotaIcms"
                label="Aliquota ICMS"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="valorIcms"
                label="Valor ICMS"
                mask="money"
                disabled={values?.calculoAutomaticoIcms}
              />
            </Grid>

            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="origemMercadoria"
                label="Origem da Mercadoria"
                mask="numberZeroLeft"
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField size="small" name="modalidadeBcSt" label="Modalidade BC ST" />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="valorBaseCalculoStRet"
                label="Valor BC ST Ret"
                mask="money"
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField size="small" name="aliquotaSt" label="Aliquota ST" mask="percentage" />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="valorIcmsStRetido"
                label="Valor ICMS ST Retido"
                mask="money"
              />
            </Grid>
            <Grid xs={12} md={2}>
              <RHFTextField
                size="small"
                name="valorIcmsProprioSubstituto"
                label="Valor ICMS Próprio Substituto"
                mask="money"
              />
            </Grid>

            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: -1 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Área PIS
              </Typography>
              <RHFSwitch name="calculoAutomaticoPis" label="Cálculo automático" />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="pisCst"
                label="PIS CST"
                max={3}
                mask="numberZeroLeft"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorBaseCalculoPis"
                label="Valor BC PIS"
                mask="money"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="aliquotaPis"
                label="Aliquota PIS"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorPis"
                label="Valor PIS"
                mask="money"
                disabled={values?.calculoAutomaticoPis}
              />
            </Grid>

            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: -1 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Área COFINS
              </Typography>
              <RHFSwitch name="calculoAutomaticoCofins" label="Cálculo automático" />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="cofinsCst"
                label="COFINS CST"
                max={3}
                mask="numberZeroLeft"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorBaseCalculoCofins"
                label="Valor BC COFINS"
                mask="money"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="aliquotaCofins"
                label="Aliquota COFINS"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorCofins"
                label="Valor COFINS"
                mask="money"
                disabled={values?.calculoAutomaticoCofins}
              />
            </Grid>

            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: -1 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Área IBS/CBS
              </Typography>
              <RHFSwitch name="calculoAutomaticoIbsCbs" label="Cálculo automático" />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="ibsCbsCst"
                label="IBS/CBS CST"
                mask="numberZeroLeft"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="codigoClassTrib"
                label="Cod. Class. Trib."
                mask="numberZeroLeft"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="porcentagemBaseCalculoIbsCbs"
                label="BC IBS/CBS"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorBaseCalculoIbsCbs"
                label="Valor BC IBS/CBS"
                mask="money"
                disabled={values?.calculoAutomaticoIbsCbs}
              />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="aliquotaIbsUf"
                label="Alíquota IBS UF"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="aliquotaIbsMun"
                label="Alíquota IBS Mun"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="aliquotaCbs"
                label="Alíquota CBS"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorCbs"
                label="Valor CBS"
                mask="money"
                disabled={values?.calculoAutomaticoIbsCbs}
              />
            </Grid>

            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorIbsUf"
                label="Valor IBS UF"
                mask="money"
                disabled={values?.calculoAutomaticoIbsCbs}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorIbsMun"
                label="Valor IBS Mun"
                mask="money"
                disabled={values?.calculoAutomaticoIbsCbs}
              />
            </Grid>

            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Área IPI Devolvido
              </Typography>
            </Grid>

            <Grid xs={12} md={3}>
              <RHFSwitch name="devolverIpi" label="Devolver IPI" />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="porcentagemIpiDevolvido"
                label="% IPI Devolvido"
                mask="percentage"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField
                size="small"
                name="valorIpiDevolvido"
                label="Valor IPI Devolvido"
                mask="money"
              />
            </Grid>
            <Grid xs={12} md={3}>
              <RHFTextField size="small" name="informacaoIpiDevolvido" label="Info IPI Devolvido" />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ mr: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Voltar{' '}
          </Button>

          <Button
            type="button"
            variant="contained"
            disabled={isSubmitting}
            onClick={() => {
              setActivateForm(true);
            }}
          >
            {currentRow?.id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
