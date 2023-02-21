import { formatNumber } from './number';

export const locales: Record<string, string> = {
  en: 'en-US',
  vi: 'vi-VN',
};

export const currencies: Record<string, string> = {
  en: 'USD',
  vi: 'VND',
};

export function formatCurrency(amount: number): string {
  return `${formatNumber(amount, locales['vi'] ?? locales.vi, {
    style: 'currency',
    currency: currencies['vi'] ?? currencies.vi,
  })}`;
}

export function getCurrencySuffix(): string {
  return process.env.LOCALE === 'en' ?'$' : 'đồng' ;
}

export function shortenCurrency(amount: number, t: any): string {
  if (amount >= 1e15) {
    return `${parseFloat((amount / 1e14).toFixed()) / 10} ${t('currency_quadrillion')}`.replace(
      '.',
      ','
    );
  }
  if (amount >= 1e12) {
    return `${parseFloat((amount / 1e11).toFixed()) / 10} ${t('currency_trillion')}`.replace(
      '.',
      ','
    );
  }
  if (amount >= 1e9) {
    return `${parseFloat((amount / 1e8).toFixed()) / 10} ${t('currency_billion')}`.replace(
      '.',
      ','
    );
  }
  if (amount >= 1e6) {
    return `${parseFloat((amount / 1e5).toFixed()) / 10} ${t('currency_million')}`.replace(
      '.',
      ','
    );
  }
  return formatCurrency(amount);
}
