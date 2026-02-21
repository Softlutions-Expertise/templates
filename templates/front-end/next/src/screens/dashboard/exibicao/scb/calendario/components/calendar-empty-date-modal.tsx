import { Iconify } from '@/components';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { fDate } from '@softlutions/utils';

// ----------------------------------------------------------------------

interface CalendarEmptyDateModalProps {
  open: boolean;
  date: string | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

export default function CalendarEmptyDateModal({
  open,
  date,
  loading,
  onClose,
  onConfirm,
}: CalendarEmptyDateModalProps) {
  const handleConfirm = () => {
    if (date) {
      onConfirm(date);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6">Gerar e Enviar Bilheteria</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Não foram enviadas as bilheteiras da data selecionada. Deseja gerar e enviar a bilheteria
          para a data <strong>{date ? fDate("d 'de' MMMM 'de' yyyy", date) : ''}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} size="medium" disabled={loading}>
          Cancelar
        </Button>

        <LoadingButton
          variant="contained"
          onClick={handleConfirm}
          size="medium"
          startIcon={<Iconify icon="solar:upload-bold" />}
          loading={loading}
        >
          Confirmar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
