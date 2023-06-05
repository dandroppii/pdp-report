import { format, parseISO } from 'date-fns';

type DatetimeFormat =
  | 'dd/MM/yyyy'
  | 'dd/MM/yyyy'
  | 'dd/MM/yyyy HH:mm'
  | 'dd/MM/yyyy HH:mm:ss'
  | 'dd/MM/yyyy hh:mm:ss a'
  | 'HH:mm dd/MM/yyyy'
  | 'HH:mm:ss dd/M/yyyy'
  | 'HH:mm:ss dd/MM/yyyy'
  | 'yyyy-MM-dd'
  | 'dd-MM-yyyy'
  | 'HH:mm dd-MM-yyyy'
  | 'dd/MM/yyyy'
  | 'MM/yyyy'
  | 'yyyyMMdd';

export function formatDatetime(date: number, f: DatetimeFormat = 'dd/MM/yyyy HH:mm') {
  if (!date) {
    return '';
  }
  try {
    return format(new Date(date), f);
  } catch (error) {
    console.log('🚀 ~ file: datetime.ts:20 ~ formatDatetime ~ error', error);
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
