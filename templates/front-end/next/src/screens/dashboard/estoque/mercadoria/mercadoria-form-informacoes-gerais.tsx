import { IEstoqueContext } from '@/models';
import { Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { RHFSelect, RHFSwitch, RHFTextField } from '@softlutions/components';

// ----------------------------------------------------------------------

interface Props {
  context?: IEstoqueContext;
}

export function MercadoriaFormInformacoesGerais({ context }: Props) {
  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={3} columnSpacing={2}>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações da mercadoria
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFSwitch name="ativo" label="Ativo" />
                <RHFSwitch name="venderWeb" label="Vender Web" />
                <RHFSwitch name="venderPdv" label="Vender PDV" />
                <RHFSwitch name="venderAutoatendimento" label="Vender Autoatendimento" />
                <RHFSwitch name="totalizador" label="Totalizador" />
                <RHFSwitch name="operacaoEstoque" label="Operação Estoque" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="id" label="Código" disabled />
                <RHFTextField name="descricao" label="Descrição" disabled />
                <RHFTextField name="codigoBarras" label="Código de Barras" disabled />
                <RHFTextField name="qrCode" label="QR Code" disabled />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="mercadoriaOperacao" label="Mercadoria Operação" disabled />
                <RHFTextField name="informacaoAdicional" label="Informação Adicional" />
                <RHFTextField name="ncm" label="NCM" disabled />
                <RHFTextField name="cest" label="CEST" mask="number" disabled />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="grupoMercadoria" label="Grupo" disabled />
                <RHFSelect name="unidadeMedida" label="Unidade de Medida" disabled>
                  {context?.unidadeMedida?.map((item) => (
                    <MenuItem key={item.cod} value={item.cod}>
                      {item.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField name="valorVenda" label="Valor de Venda" mask="money" />
                <RHFTextField name="valorCusto" label="Valor de Custo" mask="money" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFSelect name="regraTributaria" label="Regra Tributária" cleanFild>
                  {context?.regraTributaria?.map((item) => (
                    <MenuItem key={item?.cod} value={item?.cod}>
                      {item?.descricao}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Informações de estoque
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <RHFTextField name="saldoAtual" label="Saldo Atual" disabled mask="number" />
                <RHFTextField name="saldoMinimoWeb" label="Saldo Mìnimo Web" mask="number" />
                <RHFTextField name="saldoMinimoAutoatendimento" label="Saldo Mìnimo Autoatendimento" mask="number" />
                <RHFTextField name="saldoMinimoPdv" label="Saldo Mìnimo PDV" mask="number" />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Outros
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={3}>
                <RHFTextField name="observacoes" label="Observações" multiline rows={4} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );
}
