import { IBilheteria } from '@/models';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

interface Props {
  currentData?: IBilheteria;
}

export function BilheteriaViewerMensagem({ currentData }: Props) {
  const mensagens = currentData?.mensagens || [];

  return (
    <Grid xs={12}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Mensagens
            </Typography>
          </Grid>

          {mensagens.length === 0 && (
            <Grid xs={12}>
              <Typography variant="body2" color="text.disabled">
                Nenhuma mensagem disponível.
              </Typography>
            </Grid>
          )}

          {mensagens.map((item, index) => (
            <Grid xs={12} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={4}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{ mb: 1 }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Tipo
                    </Typography>
                    <Typography>
                      {item.tipoMensagem?.cod + '-' + item.tipoMensagem?.descricao ||
                        '- - - - - - -'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Código
                    </Typography>
                    <Typography>{item.codigoMensagem || '- - - - - - -'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Data Hora de Início
                    </Typography>
                    <Typography>{item.dataHoraInicio || '- - - - - - -'}</Typography>
                  </Box>
                </Stack>

                <Typography variant="body2" fontWeight="bold">
                  Mensagem
                </Typography>
                <Typography>{item.textoMensagem}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
}
