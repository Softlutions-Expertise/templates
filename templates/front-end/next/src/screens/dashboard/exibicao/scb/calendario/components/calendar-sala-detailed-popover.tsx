import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Popover, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fDate } from '@softlutions/utils';

// ----------------------------------------------------------------------

interface CalendarSalaDetailedPopoverProps {
  open: boolean;
  anchorPosition: { top: number; left: number } | null;
  selectedDate: string;
  originalSalas: Record<string, any[]>;
  onClose: () => void;
  onSalaClick: (sala: any) => void;
}

export default function CalendarSalaDetailedPopover({
  open,
  anchorPosition,
  selectedDate,
  originalSalas,
  onClose,
  onSalaClick,
}: CalendarSalaDetailedPopoverProps) {
  const theme = useTheme();

  const daySalas = originalSalas[selectedDate] || [];

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition || { top: 0, left: 0 }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          maxWidth: 320,
          maxHeight: 400,
          boxShadow: theme.customShadows.dropdown,
          p: 0,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: 'grey.900',
          color: 'common.white',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {selectedDate ? fDate("d 'de' MMMM 'de' yyyy", selectedDate) : 'Salas'}
        </Typography>

        <IconButton size="small" onClick={onClose} sx={{ color: 'common.white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={1}>
          {daySalas.map((sala, index) => (
            <Box
              key={index}
              onClick={() => onSalaClick(sala)}
              sx={{
                bgcolor: sala.backgroundColor,
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-block',
                '&:hover': {
                  opacity: 0.85,
                },
              }}
            >
              {sala.title}
            </Box>
          ))}
        </Stack>
      </Box>
    </Popover>
  );
}
