import { CustomPopover, Iconify, usePopover } from '@/components';
import { IconButton, LinearProgress, MenuItem, Stack, Typography } from '@mui/material';

import { MOTHES } from '../enums';

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  {
    value: 'dayGridMonth',
    label: 'Month',
    icon: 'mingcute:calendar-month-line',
  },
  { value: 'timeGridWeek', label: 'Week', icon: 'mingcute:calendar-week-line' },
  { value: 'timeGridDay', label: 'Day', icon: 'mingcute:calendar-day-line' },
  {
    value: 'listWeek',
    label: 'Agenda',
    icon: 'fluent:calendar-agenda-24-regular',
  },
] as const;

interface CalendarToolbarProps {
  date?: Date;
  view: string;
  loading?: boolean;
  onNextDate: () => void;
  onPrevDate: () => void;
  onChangeView: (view: string) => void;
  onOpenFilters: () => void;
}

export default function CalendarToolbar({
  date,
  view,
  loading,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilters,
}: CalendarToolbarProps) {
  const popover = usePopover();

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, pr: 2, position: 'relative' }}
      >
        <>??????</>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={onPrevDate}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Typography variant="h6">
            {!date ? 'Carregando' : MOTHES[new Date(date).getMonth()]}
          </Typography>

          <IconButton onClick={onNextDate}>
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={onOpenFilters} disabled={true}>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Stack>

        {loading && (
          <LinearProgress
            color="inherit"
            sx={{
              height: 2,
              width: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}
          />
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-left"
        sx={{ width: 160 }}
      >
        {VIEW_OPTIONS.map((viewOption) => (
          <MenuItem
            key={viewOption.value}
            selected={viewOption.value === view}
            onClick={() => {
              popover.onClose();
              onChangeView(viewOption.value);
            }}
          >
            <Iconify icon={viewOption.icon} />
            {viewOption.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
