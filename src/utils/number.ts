export function formatNumber(
  number: number,
  locale?: string,
  options?: Intl.NumberFormatOptions,
) {
  return Intl.NumberFormat(locale, options).format(number)
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}
