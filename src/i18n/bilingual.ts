export type Locale = 'ar' | 'en'

export const LOCALES: readonly Locale[] = ['ar', 'en']

/** Every user-facing string exists in both languages. */
export type Bilingual = Record<Locale, string>

export const dirOf = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr')

const NUMBER_FORMATS: Record<Locale, Intl.NumberFormat> = {
  ar: new Intl.NumberFormat('ar-EG'),
  en: new Intl.NumberFormat('en-US'),
}

/** Formats a whole number with the locale's own digits (Arabic-Indic for `ar`), e.g. for a quiz score. */
export const formatNumber = (locale: Locale, value: number): string => NUMBER_FORMATS[locale].format(value)

const DATE_FORMATS: Record<Locale, Intl.DateTimeFormat> = {
  ar: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }),
  en: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }),
}

/** Formats an ISO date string (e.g. a recorded quiz attempt's `date`) in the locale's own format. */
export const formatDate = (locale: Locale, iso: string): string => DATE_FORMATS[locale].format(new Date(iso))
