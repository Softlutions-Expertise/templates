'use client';

import { useEffect, useState } from 'react';
import { CalendarMonthlyData, CalendarYearlyData } from '@/models';

import { calendarioService } from '@/services/dashboard/exibicao/scb/calendario-service';

interface UseSalaDataProps {
  year?: string;
  month?: number;
  reloadSalas: boolean;
  setReloadSalas: (reload: boolean) => void;
}

interface UseSalaDataReturn {
  originalApiData: any[];
  salasLoading: boolean;
  setOriginalApiData: (data: any[]) => void;
}

export default function useSalaData({
  year,
  month,
  reloadSalas,
  setReloadSalas,
}: UseSalaDataProps): UseSalaDataReturn {
  const [originalApiData, setOriginalApiData] = useState<any[]>([]);
  const [salasLoading, setSalasLoading] = useState<boolean>(false);

  useEffect(() => {
    if (year) {
      setSalasLoading(true);

      if (month) {
        calendarioService
          .getMonthlyView(parseInt(year), month)
          .then((monthlyData: CalendarMonthlyData) => {
            const allSalas: any[] = [];

            monthlyData.forEach((dateData, dateIndex) => {
              if (dateData.salas && dateData.salas.length > 0) {
                const salasFromSalas = dateData.salas.map((sala: any, salaIndex: number) => ({
                  id: `sala-${sala.id}-${dateIndex}-${salaIndex}`,
                  title: `${sala.nome}`,
                  start: dateData.data,
                  backgroundColor:
                    sala.status.cod === 4
                      ? '#4CAF50'
                      : sala.status.cod === 2
                      ? '#FF9800'
                      : '#F44336',
                  borderColor:
                    sala.status.cod === 4
                      ? '#4CAF50'
                      : sala.status.cod === 2
                      ? '#FF9800'
                      : '#F44336',
                  textColor: '#ffffff',
                  allDay: true,
                  extendedProps: {
                    data: dateData.data,
                    sala: sala,
                    status: sala.status,
                  },
                }));

                allSalas.push(...salasFromSalas);
              }
            });

            if (allSalas.length > 0) {
              setOriginalApiData(allSalas);
            } else {
              setOriginalApiData([]);
            }
            setSalasLoading(false);
            setReloadSalas(false);
          })
          .catch((error) => {
            setOriginalApiData([]);
            setSalasLoading(false);
            setReloadSalas(false);
          });
      } else {
        calendarioService
          .getYearlyView(parseInt(year))
          .then((yearlyData: CalendarYearlyData[]) => {
            if (Array.isArray(yearlyData) && yearlyData.length > 0) {
              const salasFormatted: any[] = yearlyData.map((dateData, index) => {
                const [year, month, day] = dateData.data.split('-').map(Number);
                const date = new Date(year, month - 1, day);

                // - Se totalOutros = 0: fica verde
                // - Se totalValidado = 0: fica vermelho
                // - Se totalOutros > 0 && totalValidado > 0: fica amarelo
                let backgroundColor = '#4CAF50'; // Verde por padrão
                let statusText = 'Sem salas';

                const hasValidados = dateData.totalValidado > 0;
                const hasOutros = dateData.totalOutros > 0;
                const totalCount = dateData.totalValidado + dateData.totalOutros;

                if (totalCount === 0) {
                  backgroundColor = '#4CAF50';
                  statusText = 'Sem salas';
                } else if (hasValidados && !hasOutros) {
                  // Apenas validados - Verde
                  backgroundColor = '#4CAF50';
                  statusText = `${dateData.totalValidado} validados`;
                } else if (!hasValidados && hasOutros) {
                  // Apenas outros - Vermelho
                  backgroundColor = '#F44336';
                  statusText = `${dateData.totalOutros} não validados`;
                } else if (hasValidados && hasOutros) {
                  // Mistura de validados e outros - Amarelo
                  backgroundColor = '#FF9800';
                  statusText = `${dateData.totalValidado} validados, ${dateData.totalOutros} outros`;
                }

                return {
                  id: `yearly-${index}`,
                  title: statusText,
                  start: date,
                  end: date,
                  backgroundColor,
                  borderColor: backgroundColor,
                  textColor: '#ffffff',
                  description: `Total: ${totalCount} salas`,
                  letivo: true,
                  valido: dateData.totalValidado > 0,
                  differentStartEnd: false,
                  allDay: true,
                };
              });
              setOriginalApiData(salasFormatted);
            } else {
              setOriginalApiData([]);
            }
            setSalasLoading(false);
            setReloadSalas(false);
          })
          .catch((error) => {
            setOriginalApiData([]);
            setSalasLoading(false);
            setReloadSalas(false);
          });
      }
    }
  }, [reloadSalas, year, month, setReloadSalas]);

  return {
    originalApiData,
    salasLoading,
    setOriginalApiData,
  };
}
