'use client';

import { useEffect, useState } from 'react';
import { Container, usePopover } from '@/components';
import { CalendarEventColor, CalendarEventsProps } from '@/models';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import CalendarFull from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Box, Card, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useBoolean, useResponsive } from '@softlutions/hooks';
import { fDate } from '@softlutions/utils';

import { CALENDAR_CONFIG, MOTHES } from '../enums';
import {
  useCalendar,
  useEmptyDateActions,
  useSalaActions,
  useSalaData,
  useSalaProcessing,
} from '../hooks';
import { StyledCalendar } from '../styles/calendar-styled';
import CalendarEmptyDateModal from './calendar-empty-date-modal';
import CalendarSalaActionsModal from './calendar-sala-actions-modal';
import CalendarSalaDetailedPopover from './calendar-sala-detailed-popover';
import CalendarToolbar from './calendar-toolbar';

// ----------------------------------------------------------------------

const CUSTOM_LOCALE = {
  code: 'pt-br',
  week: {
    dow: 0,
    doy: 4,
  },
  buttonText: {
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    list: 'Lista',
  },
  weekText: 'Sem',
  allDayText: 'Todo o dia',
  moreLinkText: 'salas',
  noEventsText: 'Sem salas para mostrar',
};

// ----------------------------------------------------------------------

export default function CalendarEvents({
  year: propYear,
  month: propMonth,
}: CalendarEventsProps = {}) {
  const openFilters = useBoolean();
  const smUp = useResponsive('up', 'sm');

  const [reloadSalas, setReloadSalas] = useState<boolean>(false);
  const [colors, setColors] = useState<CalendarEventColor[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [selectedSala, setSelectedSala] = useState<any>(null);
  const [showAllSalas, setShowAllSalas] = useState<boolean>(false);

  const popover = usePopover();
  const eventModal = useBoolean();

  const {
    calendarRef,
    view,
    date,
    year,
    month,
    onDatePrev,
    onDateNext,
    onChangeView,
    onSelectRange: originalOnSelectRange,
    onClickEvent: originalOnClickEvent,
    onInitialView,
  } = useCalendar({
    initialYear: propYear,
    initialMonth: propMonth,
  });

  const { originalApiData, salasLoading } = useSalaData({
    year,
    month,
    reloadSalas,
    setReloadSalas,
  });

  const { salasYear, originalSalas } = useSalaProcessing({
    originalApiData,
    showAllSalas,
    year,
    month,
  });

  const {
    loadingRetificar,
    loadingEnviar,
    loadingConsultar,
    handleSalaRetificar,
    handleSalaEnviar,
    handleSalaConsultar,
    handleViewer,
  } = useSalaActions({
    setReloadSalas,
    onCloseModal: eventModal.onFalse,
  });

  const { emptyDateModal, loadingConfirmar, setEmptyDateModal, handleEnviarBilheteria } =
    useEmptyDateActions({
      setReloadSalas,
    });

  const onClickEvent = (arg: any) => {
    const { event, jsEvent } = arg;

    if (event.id.startsWith('summary-')) {
      const dateKey = fDate('yyyy-MM-dd', event.start);
      const daySalas = originalSalas[dateKey] || [];

      if (daySalas.length > 0) {
        const rect = jsEvent.target.getBoundingClientRect();
        setPopoverPosition({
          top: rect.top + rect.height + 8,
          left: rect.left + rect.width / 2,
        });

        setSelectedDate(dateKey);
        popover.onOpen(jsEvent);
        return;
      }
    }

    if (showAllSalas && event.extendedProps) {
      const salaData = {
        id: event.id,
        title: event.title,
        data: event.extendedProps.data,
        sala: event.extendedProps.sala,
        status: event.extendedProps.status,
      };
      handleOpenSalaModal(salaData);
      return;
    }

    originalOnClickEvent(arg);
  };

  const onDateClick = (arg: any) => {
    const clickedDate = arg.dateStr;

    const hasRealSalas = originalApiData.some((sala: any) => {
      const salaDate = new Date(sala.start);
      return salaDate.toISOString().split('T')[0] === clickedDate;
    });

    if (!hasRealSalas && month && year) {
      setEmptyDateModal({ open: true, date: clickedDate });
    }
  };

  const handlePopoverClose = () => {
    popover.onClose();
    setPopoverPosition(null);
    setSelectedDate('');
  };

  const handleOpenSalaModal = (sala: any) => {
    let salaData;

    if (sala.extendedProps) {
      salaData = {
        id: sala.id,
        title: sala.title,
        data: sala.extendedProps.data,
        sala: sala.extendedProps.sala,
        status: sala.extendedProps.status,
      };
    } else {
      let formattedDate = 'N/A';
      if (sala.start) {
        const dateObj = sala.start instanceof Date ? sala.start : new Date(sala.start);
        formattedDate = dateObj.toISOString().split('T')[0];
      } else if (sala.data) {
        formattedDate = sala.data;
      }

      salaData = {
        id: sala.id,
        title: sala.title,
        data: formattedDate,
        sala: { nome: sala.sala?.nome || 'N/A' },
        status: sala.status || { cod: 0, descricao: 'Status não disponível' },
      };
    }

    setSelectedSala(salaData);
    handlePopoverClose();
    eventModal.onTrue();
  };

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  useEffect(() => {
    const defaultColors: CalendarEventColor[] = [
      { id: 1, nome: 'Verde', cor: '#4CAF50' },
      { id: 2, nome: 'Vermelho', cor: '#F44336' },
      { id: 3, nome: 'Amarelo', cor: '#FF9800' },
      { id: 4, nome: 'Azul', cor: '#2196F3' },
    ];
    setColors(defaultColors);
  }, []);

  if (!date) return null;

  if (date) {
    return (
      <>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              mb: 3,
            }}
          >
            <Typography variant="h3">
              {MOTHES[new Date(date).getMonth()]}, {new Date(date).getFullYear()}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showAllSalas}
                  onChange={(event) => setShowAllSalas(event.target.checked)}
                  color="primary"
                />
              }
              label="Mostrar todas as salas"
              labelPlacement="start"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            />
          </Stack>
          <Card>
            <StyledCalendar>
              <Box
                sx={{
                  '& .fc-bg-event.empty-date-event': {
                    display: 'flex !important',
                    alignItems: 'center !important',
                    justifyContent: 'center !important',
                    textAlign: 'center !important',
                    fontSize: '12px !important',
                    fontWeight: '500 !important',
                    color: '#9E9E9E !important',
                    backgroundColor: 'transparent !important',
                    borderRadius: '4px !important',
                    margin: '2px !important',
                    height: 'calc(100% - 4px) !important',
                    minHeight: '30px !important',
                  },
                  '& .fc-bg-event.empty-date-event .fc-event-title': {
                    textAlign: 'center !important',
                    width: '100% !important',
                    fontSize: '11px !important',
                    lineHeight: '1.2 !important',
                  },
                }}
              >
                <CalendarToolbar
                  date={date}
                  view={view}
                  loading={salasLoading}
                  onNextDate={onDateNext}
                  onPrevDate={onDatePrev}
                  onChangeView={onChangeView}
                  onOpenFilters={openFilters.onTrue}
                />

                <CalendarFull
                  weekends
                  droppable
                  selectable={false}
                  rerenderDelay={10}
                  allDayMaintainDuration
                  eventResizableFromStart
                  ref={calendarRef}
                  initialDate={date}
                  initialView={view}
                  dayMaxEventRows={false}
                  eventDisplay="block"
                  events={salasYear}
                  headerToolbar={false}
                  eventClick={onClickEvent}
                  dateClick={onDateClick}
                  height={smUp ? 720 : 'auto'}
                  dayMaxEvents={false}
                  eventOrder="start,eventOrder,title"
                  plugins={[
                    listPlugin,
                    dayGridPlugin,
                    timelinePlugin,
                    timeGridPlugin,
                    interactionPlugin,
                  ]}
                  firstDay={0}
                  locale={CUSTOM_LOCALE}
                  dayHeaderContent={(args: any) => {
                    return (
                      <span>
                        {CALENDAR_CONFIG.views.month.getOrderedDays('short')[args.date.getDay()]}
                      </span>
                    );
                  }}
                />
              </Box>
            </StyledCalendar>
          </Card>
        </Container>
        <CalendarSalaDetailedPopover
          open={!!popover.open}
          anchorPosition={popoverPosition}
          selectedDate={selectedDate}
          originalSalas={originalSalas}
          onClose={handlePopoverClose}
          onSalaClick={handleOpenSalaModal}
        />
        <CalendarSalaActionsModal
          open={eventModal.value}
          selectedSala={selectedSala}
          loadingRetificar={loadingRetificar}
          loadingEnviar={loadingEnviar}
          loadingConsultar={loadingConsultar}
          onClose={eventModal.onFalse}
          onRetificar={handleSalaRetificar}
          onEnviar={handleSalaEnviar}
          onConsultar={handleSalaConsultar}
          onViewer={handleViewer}
        />
        <CalendarEmptyDateModal
          open={emptyDateModal.open}
          date={emptyDateModal.date}
          loading={loadingConfirmar}
          onClose={() => setEmptyDateModal({ open: false, date: null })}
          onConfirm={handleEnviarBilheteria}
        />
      </>
    );
  }
}
