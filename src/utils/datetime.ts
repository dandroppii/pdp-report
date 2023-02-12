import { format, parseISO } from 'date-fns';

type DatetimeFormat =
  | 'dd/MM/yyyy'
  | 'dd/MM/yyyy'
  | 'dd/MM/yyyy HH:mm'
  | 'HH:mm dd/MM/yyyy'
  | 'HH:mm:ss DD/M/yyyy'
  | 'HH:mm:ss dd/MM/yyyy'
  | 'yyyy-MM-DD'
  | 'dd-MM-yyyy'
  | 'HH:mm dd-MM-yyyy'
  | 'HH:mm DD-MM-yyyy';

export function formatDatetime(date: number, f: DatetimeFormat = 'dd/MM/yyyy HH:mm') {
  try {
    return format(new Date(date), f);
  } catch (error) {
    return '';
  }
}

interface Time {
  year: number | string;
  month: number | string;
}

export function isCurrentMonth(time: Time) {
  const currentYear = format(new Date(), 'yyyy');
  const currentMonth = format(new Date(), 'MM');

  return currentYear === time.year.toString() && currentMonth === time.month.toString();
}
