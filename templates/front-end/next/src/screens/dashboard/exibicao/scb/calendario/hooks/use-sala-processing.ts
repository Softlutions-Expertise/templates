'use client';

import { fDate } from '@softlutions/utils';
import { useCallback, useEffect, useState } from 'react';

interface UseSalaProcessingProps {
  originalApiData: any[];
  showAllSalas: boolean;
  year?: string;
  month?: number;
}

interface UseSalaProcessingReturn {
  salasYear: any[];
  originalSalas: Record<string, any[]>;
  generateEmptyDateSalas: (allSalas: any[], year: number, month?: number) => any[];
}

export default function useSalaProcessing({
  originalApiData,
  showAllSalas,
  year,
  month
}: UseSalaProcessingProps): UseSalaProcessingReturn {
  const [salasYear, setSalasYear] = useState<any[]>([]);
  const [originalSalas, setOriginalSalas] = useState<Record<string, any[]>>({});

  const generateEmptyDateSalas = (allSalas: any[], year: number, month?: number) => {
    const emptyDateSalas: any[] = [];

    if (month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      const existingDates = new Set(
        allSalas.map(sala => {
          const salaDate = new Date(sala.start);
          return salaDate.toISOString().split('T')[0];
        })
      );

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if (!existingDates.has(dateStr)) {
          emptyDateSalas.push({
            id: `empty-date-${dateStr}`,
            title: 'Sem envios nesta data',
            start: dateStr,
            backgroundColor: 'rgba(224, 224, 224, 0.1)',
            borderColor: 'transparent',
            textColor: '#9E9E9E',
            allDay: true,
            display: 'background',
            classNames: ['empty-date-event'],
            extendedProps: {
              date: dateStr,
              isEmpty: true
            }
          });
        }
      }
    }

    return emptyDateSalas;
  };


  const processAndSetSalas = useCallback((salasFormatted: any[]) => {
    let allSalasWithEmpty = [...salasFormatted];
    if (month && year) {
      const emptyDateSalas = generateEmptyDateSalas(salasFormatted, parseInt(year), month);
      allSalasWithEmpty = [...salasFormatted, ...emptyDateSalas];
    }

    if (showAllSalas) {
      setSalasYear(allSalasWithEmpty);
      setOriginalSalas({});
      return;
    }

    const salasToGroup = allSalasWithEmpty.filter(sala => !sala.extendedProps?.isEmpty);
    const emptySalas = allSalasWithEmpty.filter(sala => sala.extendedProps?.isEmpty);

    const salasByDate = salasToGroup.reduce((acc: any, sala: any) => {
      const dateKey = fDate('yyyy-MM-dd', sala.start);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(sala);
      return acc;
    }, {});

    const finalSalas: any[] = [...emptySalas];
    const salasForPopover: Record<string, any[]> = {};

    Object.keys(salasByDate).forEach(dateKey => {
      const daySalas = salasByDate[dateKey];

      if (daySalas.length < 2) {
        finalSalas.push(...daySalas);
      } else {
        salasForPopover[dateKey] = daySalas;

        const validatedSalas = daySalas.filter((e: any) => e.backgroundColor === "#4CAF50");
        const analysisSalas = daySalas.filter((e: any) => e.backgroundColor === "#FF9800");
        const otherSalas = daySalas.filter((e: any) => e.backgroundColor !== "#4CAF50" && e.backgroundColor !== "#FF9800");

        const salaDate = daySalas[0].start;

        const summaryEvents = [];

        // Primeiro: Bloco verde (Validados)
        if (validatedSalas.length > 0) {
          const validatedEvent = {
            id: `summary-valid-${dateKey}`,
            title: `Validados: ${validatedSalas.length}`,
            start: salaDate,
            end: salaDate,
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
            textColor: "#ffffff",
            description: `Validados: ${validatedSalas.length}`,
            letivo: true,
            valido: true,
            differentStartEnd: false,
            allDay: true,
            order: 1,
            eventOrder: 1,
          };
          summaryEvents.push(validatedEvent);
        }

        // Segundo: Bloco amarelo (Em Análise)
        if (analysisSalas.length > 0) {
          const analysisEvent = {
            id: `summary-analysis-${dateKey}`,
            title: `Em Análise: ${analysisSalas.length}`,
            start: salaDate,
            end: salaDate,
            backgroundColor: "#FF9800",
            borderColor: "#FF9800",
            textColor: "#ffffff",
            description: `Em Análise: ${analysisSalas.length}`,
            letivo: true,
            valido: false,
            differentStartEnd: false,
            allDay: true,
            order: 2,
            eventOrder: 2,
          };
          summaryEvents.push(analysisEvent);
        }

        // Terceiro: Bloco vermelho (Outros)
        if (otherSalas.length > 0) {
          const otherEvent = {
            id: `summary-other-${dateKey}`,
            title: `Outros: ${otherSalas.length}`,
            start: salaDate,
            end: salaDate,
            backgroundColor: "#F44336",
            borderColor: "#F44336",
            textColor: "#ffffff",
            description: `Outros: ${otherSalas.length}`,
            letivo: true,
            valido: false,
            differentStartEnd: false,
            allDay: true,
            order: 3,
            eventOrder: 3,
          };
          summaryEvents.push(otherEvent);
        }
        finalSalas.push(...summaryEvents);
      }
    });

    const sortedSalas = finalSalas.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order;
      }
      if (a.order) return -1;
      if (b.order) return 1;
      return 0;
    });

    setSalasYear(sortedSalas);
    setOriginalSalas(salasForPopover);
  }, [showAllSalas, year, month]);

  useEffect(() => {
    if (originalApiData.length > 0) {
      processAndSetSalas(originalApiData);
    } else {
      setSalasYear([]);
      setOriginalSalas({});
    }
  }, [originalApiData, processAndSetSalas]);

  return {
    salasYear,
    originalSalas,
    generateEmptyDateSalas,
  };
}
