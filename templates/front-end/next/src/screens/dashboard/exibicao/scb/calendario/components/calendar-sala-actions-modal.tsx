import { Guard, Iconify } from '@/components';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

interface CalendarSalaActionsModalProps {
  open: boolean;
  selectedSala: any;
  loadingRetificar: boolean;
  loadingEnviar: boolean;
  loadingConsultar: boolean;
  onClose: () => void;
  onRetificar: (sala: any) => void;
  onEnviar: (sala: any) => void;
  onConsultar: (sala: any) => void;
  onViewer: (sala: any) => void;
}

export default function CalendarSalaActionsModal({
  open,
  selectedSala,
  loadingRetificar,
  loadingEnviar,
  loadingConsultar,
  onClose,
  onRetificar,
  onEnviar,
  onConsultar,
  onViewer,
}: CalendarSalaActionsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{selectedSala?.title || 'Sala'}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {selectedSala && (
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Data
                </Typography>
                <Typography variant="body2">{selectedSala.data}</Typography>
              </Box>
            </Grid>

            <Grid xs={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={selectedSala.status?.descricao || 'N/A'}
                  color={
                    selectedSala.status?.cod === 4
                      ? 'success'
                      : selectedSala.status?.cod === 2
                      ? 'warning'
                      : 'error'
                  }
                  size="small"
                />
              </Box>
            </Grid>

            <Grid xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ações
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Guard roles={['!suporte']}>
            <LoadingButton
              variant="outlined"
              startIcon={<Iconify icon="solar:refresh-bold" />}
              onClick={() => onRetificar(selectedSala!)}
              loading={loadingRetificar}
              size="medium"
            >
              Retificar
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              startIcon={<Iconify icon="solar:upload-bold" />}
              onClick={() => onEnviar(selectedSala!)}
              disabled={selectedSala?.status?.cod !== 1}
              loading={loadingEnviar}
              size="medium"
            >
              Enviar
            </LoadingButton>
          </Guard>

          <LoadingButton
            variant="outlined"
            startIcon={<Iconify icon="solar:calendar-search-bold" />}
            onClick={() => onConsultar(selectedSala!)}
            loading={loadingConsultar}
            size="medium"
          >
            Consultar
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            startIcon={<Iconify icon="solar:eye-bold" />}
            onClick={() => onViewer(selectedSala!)}
            size="medium"
          >
            Visualizar
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
