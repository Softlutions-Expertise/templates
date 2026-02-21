'use client';

import { useEffect, useState } from 'react';
import { CalendarEventsYearProps, CalendarYearlyData, MarkedDay } from '@/models';
import { calendarioService } from '@/services';
import { Box, Card, Stack, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { getLocalItem } from '@softlutions/utils';
import { m } from 'framer-motion';

import { useSettingsContext } from '@/components/settings';

import { CALENDAR_CONFIG } from '../enums';

// ----------------------------------------------------------------------

const VARIANTS = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 },
};

// ----------------------------------------------------------------------

const CalendarEventsYear = ({
  month,
  year,
  daysOfOtherMonths = true,
  onClick,
  forceShowEvents = false,
}: CalendarEventsYearProps) => {
  const settings = useSettingsContext();
  const isMinDesktop = getLocalItem('isMinDesktop');

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(year, month - 1));
  const [showEvents, setShowEvents] = useState<boolean>(forceShowEvents);
  const [markedDays, setMarkedDays] = useState<MarkedDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const monthInfo = markedDays?.filter((d: MarkedDay) => d?.month === month - 1);

  const loadYearlyData = async () => {
    if (!year) return;

    setLoading(true);
    try {
      const yearlyData: CalendarYearlyData[] = await calendarioService.getYearlyView(year);

      if (Array.isArray(yearlyData) && yearlyData.length > 0) {
        const processedDays: MarkedDay[] = yearlyData.map((dateData) => {
          const [year, month, day] = dateData.data.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          const dayOfMonth = date.getDate();
          const monthIndex = date.getMonth();

          // - Se totalOutros = 0: fica verde
          // - Se totalValidado = 0: fica vermelho
          // - Se totalOutros > 0 && totalValidado > 0: fica amarelo
          let color = '#4CAF50';
          let description = 'Sem eventos';

          if (dateData.totalOutros === 0) {
            color = '#4CAF50';
            description = `${dateData.totalValidado} validados`;
          } else if (dateData.totalValidado === 0) {
            color = '#F44336';
            description = `${dateData.totalOutros} não validados`;
          } else if (dateData.totalOutros > 0 && dateData.totalValidado > 0) {
            color = '#FF9800';
            description = `${dateData.totalValidado} validados, ${dateData.totalOutros} outros`;
          }

          return {
            day: dayOfMonth,
            month: monthIndex,
            year: date.getFullYear(),
            color: color,
            description: description,
            data: dateData,
          };
        });

        setMarkedDays(processedDays);
      } else {
        setMarkedDays([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados anuais da API:', error);
      setMarkedDays([]);
    } finally {
      setLoading(false);
    }
  };

  const generateDays = () => {
    const days: JSX.Element[] = [];
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysOfPreviousMonth = firstDayOfMonth;
    const daysInPreviousMonth = new Date(currentYear, currentMonthIndex, 0).getDate();

    for (let i = daysInPreviousMonth - daysOfPreviousMonth + 1; i <= daysInPreviousMonth; i++) {
      days.push(
        <Typography
          key={`prev${i}`}
          variant="body1"
          sx={{ opacity: 0.8, color: 'text.disabled', textAlign: 'center' }}
        >
          {daysOfOtherMonths ? i : ' '}
        </Typography>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayInfo = monthInfo.find((d: MarkedDay) => d.day === day);
      const dayStyle = dayInfo
        ? {
            backgroundColor: dayInfo.color,
            color: '#fff',
            borderRadius: '10%',
            opacity: 0.8,
          }
        : {};

      days.push(
        <Tooltip
          key={`tooltip-${day}`}
          title={dayInfo?.description || ''}
          sx={{ color: dayInfo?.color, backgroundColor: `${dayInfo?.color}33` }}
        >
          <Typography
            key={`current${day}`}
            variant="body1"
            textAlign="center"
            sx={{
              ...dayStyle,
              height: {
                xs: 25,
                lg:
                  settings.themeLayout === 'vertical'
                    ? (isMinDesktop && 40) || 30
                    : (isMinDesktop && 30) || 37,
                xl: settings.themeLayout === 'vertical' ? 30 : 35,
              },
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {day}
          </Typography>
        </Tooltip>,
      );
    }

    const totalDaysUsed = daysOfPreviousMonth + daysInMonth;
    const TOTAL_CALENDAR_DAYS = 42;
    const nextMonthDaysNeeded = TOTAL_CALENDAR_DAYS - totalDaysUsed;

    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
      days.push(
        <Typography
          key={`next${i}`}
          variant="body1"
          sx={{ opacity: 0.8, color: 'text.disabled', textAlign: 'center' }}
        >
          {daysOfOtherMonths ? i : ''}
        </Typography>,
      );
    }

    return days;
  };

  useEffect(() => {
    loadYearlyData();
  }, [year]);

  useEffect(() => {
    setCurrentMonth(new Date(year, month - 1));
  }, [month, year]);

  useEffect(() => {
    setShowEvents(forceShowEvents);
  }, [forceShowEvents]);

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid xs={12}>
        <Card
          sx={{
            p: 3,
            pb: 2,
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 12px 16px rgba(0, 0, 0, 0.3)',
            },
          }}
          onClick={onClick}
        >
          <Typography variant="h6" sx={{ mb: 2, mt: -1 }}>
            {CALENDAR_CONFIG.months[month - 1]}
          </Typography>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridTemplateRows="repeat(7, 1fr)"
            minHeight={{
              xs: 200,
              lg:
                settings.themeLayout === 'vertical'
                  ? (isMinDesktop && 280) || 210
                  : (isMinDesktop && 210) || 259,
              xl: settings.themeLayout === 'vertical' ? 210 : 245,
            }}
          >
            {CALENDAR_CONFIG.days.getOrderedDays(0, 'short').map((day: string, index: number) => (
              <Typography key={`day${index}`} variant="subtitle1">
                {day}
              </Typography>
            ))}
            {generateDays()}
          </Box>
        </Card>
        <m.div
          initial="hidden"
          animate={forceShowEvents || showEvents ? 'visible' : 'hidden'}
          variants={VARIANTS}
          transition={{ duration: 0.5 }}
          style={{
            transition: 'display 0.5s ease-in-out',
            display: forceShowEvents || showEvents ? 'block' : 'none',
          }}
        >
          <Card
            sx={{
              px: 3,
              py: 2,
              boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)',
              mt: 0.5,
              cursor: 'pointer',
            }}
          >
            {monthInfo.length === 0 ? (
              <Typography variant="subtitle1" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                Nenhum evento nesse mês
              </Typography>
            ) : (
              <Stack spacing={1}>
                {monthInfo.map((item: MarkedDay, index: number) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    borderRadius="10%"
                  >
                    <Typography
                      key={`current${item.day}`}
                      variant="body1"
                      textAlign="center"
                      sx={{
                        backgroundColor: item.color,
                        color: '#fff',
                        borderRadius: '10%',
                        height: {
                          xs: 25,
                          lg: 30,
                          xl: 37,
                        },
                        width: {
                          xs: 25,
                          lg: 30,
                          xl: 37,
                        },
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.day}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        height: {
                          xs: 25,
                          lg: 30,
                          xl: 37,
                        },
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        px: 0.5,
                        color: item.color,
                        backgroundColor: `${item.color}33`,
                        borderRadius: '10%',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </m.div>
      </Grid>
    </Grid>
  );
};

export default CalendarEventsYear;
