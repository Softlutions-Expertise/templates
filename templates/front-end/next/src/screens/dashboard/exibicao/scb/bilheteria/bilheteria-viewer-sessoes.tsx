import { IBilheteria, ITipoAssentoBilheteria } from '@/models';
import {
  Box,
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IBilheteria;
}

export function BilheteriaViewerSessoes({ currentData }: Props) {
  const sessoes = currentData?.sessoes || [];

  const renderAssentos = (assentos: ITipoAssentoBilheteria[]) => {
    return assentos.map((assento, idx) => (
      <Box key={idx} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={6}>
                Assentos {assento.tipoAssento.descricao}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                Ingressos
              </TableCell>
              <TableCell align="center" colSpan={3}>
                Pagamentos
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tipo Ingresso</TableCell>
              <TableCell>Espectadores</TableCell>
              <TableCell>Meios Tradicionais</TableCell>
              <TableCell>Vale Cultura</TableCell>
              <TableCell>Outros</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assento.totalCategoriaIngresso.map((ingresso, idx2) => {
              const getValor = (modalidadeCod: number) =>
                ingresso.modalidades.find((m) => m.modalidadePagamentoScb.cod === modalidadeCod)
                  ?.valorArrecadado ?? 0;

              return (
                <TableRow key={idx2}>
                  <TableCell>{ingresso.tipoIngresso.descricao}</TableCell>
                  <TableCell>{ingresso.espectadores}</TableCell>
                  <TableCell>{`R$ ${getValor(1).toFixed(2)}`}</TableCell>
                  <TableCell>{`R$ ${getValor(2).toFixed(2)}`}</TableCell>
                  <TableCell>{`R$ ${getValor(3).toFixed(2)}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    ));
  };

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Sessões
            </Typography>
          </Grid>

          {sessoes.length === 0 && (
            <Grid xs={12}>
              <Typography variant="body2" color="text.disabled">
                Nenhuma sessão disponível.
              </Typography>
            </Grid>
          )}

          {sessoes.map((sessao, idx) => (
            <Grid xs={12} key={idx}>
              {sessao.obras.map((obra, obraIdx) => (
                <Box key={obraIdx} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, mb: 3 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Obra
                  </Typography>
                  <Typography>
                    {obra.tituloObra} ({obra.distribuidor?.razaoSocial})
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2 }}>
                    <Typography>Hora: {sessao.dataHoraInicio}</Typography>
                    <Typography>Modalidade: {sessao.tipoSessao?.descricao}</Typography>
                    <Typography>Tela: {obra.tipoTelaScb?.descricao}</Typography>
                    <Typography>Projeção: {obra.tipoProjecao?.descricao}</Typography>
                    <Typography>Idioma: {obra.idiomaExibicao?.descricao}</Typography>
                    <Typography>Legenda: {obra.legenda ? 'sim' : 'não'}</Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    {renderAssentos(
                      sessao.totalTipoAssento.filter((a) =>
                        a.tipoAssento.descricao.toLowerCase().includes('padrão'),
                      ),
                    )}
                    {renderAssentos(
                      sessao.totalTipoAssento.filter((a) =>
                        a.tipoAssento.descricao.toLowerCase().includes('especial'),
                      ),
                    )}
                  </Stack>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
}
