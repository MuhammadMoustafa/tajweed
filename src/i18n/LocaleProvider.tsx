import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dirOf, formatNumber, type Bilingual, type Locale } from './bilingual'

const STORAGE_KEY = 'tajweed.locale'

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    // storage unavailable (private mode, WebView restrictions)
  }
  return navigator.language.startsWith('ar') ? 'ar' : 'en'
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Pick the current language's string. */
  t: (text: Bilingual) => string
  /** Format a whole number with the current locale's digits (Arabic-Indic for `ar`). */
  n: (value: number) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dirOf(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, t: (text: Bilingual) => text[locale], n: (num: number) => formatNumber(locale, num) }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}

/**
 * Renders a Bilingual string in the current language, for places that build elements without
 * calling hooks themselves, e.g. a clip step's `render` (src/animations/player/clip.ts).
 */
export function Localized({ text }: { text: Bilingual }) {
  return useLocale().t(text)
}
