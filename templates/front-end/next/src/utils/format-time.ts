import { format, formatDistanceToNow, getTime } from 'date-fns';

// ----------------------------------------------------------------------
type InputValue = Date | string | number | null | undefined;

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function subtractOneDay(dateString: string): string {
  const currentDate = new Date(dateString);
  currentDate.setDate(currentDate.getDate() - 1);

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
