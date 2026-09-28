export type Locale = 'ar' | 'en'

export const LOCALES: readonly Locale[] = ['ar', 'en']

/** Every user-facing string exists in both languages. */
export type Bilingual = Record<Locale, string>

export const dirOf = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr')
