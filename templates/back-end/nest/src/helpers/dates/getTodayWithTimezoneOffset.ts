import { subDays } from 'date-fns';
import { TZ_OFFSET } from '../../config/TZ_OFFSET';

export const getTodayWithTimezoneOffset = () => {
  let today = new Date();

  if (today.getUTCHours() < TZ_OFFSET + 1) {
    today = subDays(today, 1);
  }

  today.setUTCHours(0, 0, 0, 0);

  return today;
};
