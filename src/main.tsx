import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts so the app works offline. Quran script is separate from the UI fonts.
import '@fontsource/amiri-quran/arabic-400.css'
import '@fontsource/noto-naskh-arabic/arabic-400.css'
import '@fontsource/noto-naskh-arabic/arabic-700.css'
import '@fontsource/noto-sans/latin-400.css'
import '@fontsource/noto-sans/latin-700.css'
import './styles.css'
import { App } from './App'
import { LocaleProvider } from './i18n/LocaleProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
