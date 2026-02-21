import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledCalendar = styled('div')(({ theme }) => ({
  width: 'calc(100% + 2px)',
  marginLeft: -1,
  marginBottom: -1,
  cursor: 'pointer',
  '& .fc': {
    '--fc-border-color': alpha(theme.palette.grey[500], 0.16),
    '--fc-now-indicator-color': theme.palette.error.main,
    '--fc-today-bg-color': alpha(theme.palette.grey[500], 0.08),
    '--fc-page-bg-color': theme.palette.background.default,
    '--fc-neutral-bg-color': theme.palette.background.neutral,
    '--fc-list-event-hover-bg-color': theme.palette.action.hover,
    '--fc-highlight-color': theme.palette.action.hover,
  },

  '& .fc .fc-license-message': { display: 'none' },
  '& .fc a': { color: theme.palette.text.primary },

  // Table Head
  '& .fc .fc-col-header ': {
    boxShadow: `inset 0 -1px 0 ${theme.palette.divider}`,
    '& th': { borderColor: 'transparent' },
    '& .fc-col-header-cell-cushion': {
      ...theme.typography.subtitle2,
      padding: '13px 0',
    },
  },

  // List Empty
  '& .fc .fc-list-empty': {
    ...theme.typography.h6,
    backgroundColor: 'transparent',
    color: theme.palette.text.secondary,
  },

  // Event
  '& .fc .fc-event': {
    cursor: 'pointer',
    borderColor: 'transparent !important',
  },
  '& .fc .fc-event .fc-event-main': {
    padding: '2px 4px',
    borderRadius: 6,
    color: '#ffffff', // ← Texto branco para contraste
    position: 'relative',
  },
  
  // Na grid principal: ocultar eventos originais quando há resumos
  '& .fc-daygrid-day .fc-event[data-event-id^="original-"]': {
    display: 'none !important',
  },
  
  // Na grid principal: mostrar apenas eventos de resumo
  '& .fc-daygrid-day .fc-event[data-event-id^="summary-"]': {
    display: 'block !important',
  },

  // Event Time
  '& .fc .fc-event .fc-event-time': {
    ...theme.typography.caption,
    color: '#ffffff', // ← Texto branco para contrastar com fundo colorido
  },

  // Event Title
  '& .fc .fc-event .fc-event-title': {
    ...theme.typography.subtitle2,
    color: '#ffffff', // ← Texto branco para contrastar com fundo colorido
  },

  // Ocultar botão "more" do FullCalendar pois usamos popover customizado
  '& .fc .fc-more-link': {
    display: 'none !important',
  },

  // Month View
  '& .fc .fc-daygrid-event': {
    marginTop: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  '& .fc .fc-daygrid-event.fc-event-start, & .fc .fc-daygrid-event.fc-event-end': {
    marginLeft: 8,
    marginRight: 8,
  },
  '& .fc .fc-daygrid-event .fc-event-main': {
    position: 'relative',
  },

  // Week & Day View
  '& .fc .fc-timegrid-event': {
    '& .fc-event-main': {
      position: 'relative',
    },
  },

  // Agenda View
  '& .fc-direction-ltr .fc-list-day-text, .fc-direction-rtl .fc-list-day-side-text': {
    ...theme.typography.subtitle2,
  },
  '& .fc .fc-list-event': {
    '& .fc-event-main': {
      position: 'relative',
    },
    '&:hover': {
      '& .fc-event-main': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
    },
  },
  '& .fc .fc-list-day-cushion': {
    ...theme.typography.overline,
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent !important',
  },

  // Date
  '& .fc .fc-daygrid-day-number': {
    ...theme.typography.body2,
    padding: theme.spacing(1, 1.5),
  },
  '& .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number': {
    color: theme.palette.primary.main,
    ...theme.typography.subtitle2,
  },

  // Other
  '& .fc .fc-daygrid-day-events': {
    marginTop: 4,
  },
  '& .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events': {
    minHeight: 30,
  },
}));
