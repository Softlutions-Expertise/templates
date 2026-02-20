import { addMinutes, format, isBefore, parse } from 'date-fns';

export const generateTimes = (
  startTime: string,
  endTime: string,
  intervalMinutes: number,
): string[] => {
  const horarios: string[] = [];

  if (intervalMinutes <= 0) {
    return [];
  }

  let currentTime = parse(startTime, 'HH:mm', new Date());
  const endDateTime = parse(endTime, 'HH:mm', new Date());

  horarios.push(format(currentTime, 'HH:mm'));

  currentTime = addMinutes(currentTime, intervalMinutes);

  while (intervalMinutes > 0 && isBefore(currentTime, endDateTime)) {
    horarios.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, intervalMinutes);
  }

  return horarios;
};
