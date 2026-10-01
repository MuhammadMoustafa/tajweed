import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { ContactLinks } from './ContactLinks'

/** Small, quiet footer on every page: the About page link, then the shared report/contact links. */
export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="app-footer" aria-label={t(ui.footerLabel)}>
      <a href="#/about">{t(ui.aboutTitle)}</a>
      <ContactLinks />
    </footer>
  )
}
