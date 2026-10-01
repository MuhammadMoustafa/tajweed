import { WORD_RECITATION } from '../data/quran'
import { getMatnMeta, MUTOON_SOURCE } from '../data/mutoon'
import { useLocale } from '../i18n/LocaleProvider'
import { formatTemplate, ui } from '../i18n/ui'
import { UpdateStatus } from '../update/UpdateStatus'
import { ContactLinks } from './ContactLinks'

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const
const QURAN_FOUNDATION_URL = 'https://quran.com'
const EVERYAYAH_URL = 'https://everyayah.com'
/** Licence texts shipped with the @fontsource packages (all SIL Open Font License 1.1). */
const FONTS = [
  { name: 'Amiri Quran', pkg: 'amiri-quran' },
  { name: 'Noto Naskh Arabic', pkg: 'noto-naskh-arabic' },
  { name: 'Noto Sans', pkg: 'noto-sans' },
]
const fontLicenseUrl = (pkg: string) => `https://unpkg.com/@fontsource/${pkg}/LICENSE`

/** About page (#/about): what the app is, its sources, review status, version, and contact links. */
export function AboutPage() {
  const { locale, t } = useLocale()
  return (
    <article className="about-page">
      <h2>{t(ui.aboutTitle)}</h2>

      <section>
        <h3>{t(ui.aboutWhatTitle)}</h3>
        <p>{t(ui.aboutWhat)}</p>
      </section>

      <section>
        <h3>{t(ui.aboutSourcesTitle)}</h3>
        <p>
          {formatTemplate(locale, ui.aboutQuranText, { reciter: t(WORD_RECITATION.reciter) })}{' '}
          <a href={QURAN_FOUNDATION_URL} {...EXTERNAL}>
            <bdi>Quran Foundation (quran.com)</bdi>
          </a>
        </p>
        <p>
          {t(ui.aboutAyahAudio)}{' '}
          <a href={EVERYAYAH_URL} {...EXTERNAL}>
            <bdi>EveryAyah</bdi>
          </a>
        </p>
        <p>
          {t(ui.aboutPoems)}{' '}
          <a href="https://www.alukah.net" {...EXTERNAL} lang="en" dir="ltr">
            {MUTOON_SOURCE.publisher}
          </a>
        </p>
        <ul>
          {(['tuhfa', 'jazariyya'] as const).map((id) => {
            const meta = getMatnMeta(id)
            return (
              <li key={id} lang="ar" dir="rtl">
                <a href={meta.url} {...EXTERNAL}>
                  {meta.title}
                </a>
              </li>
            )
          })}
        </ul>
        <p>{t(ui.aboutFonts)}</p>
        <ul>
          {FONTS.map((font) => (
            <li key={font.pkg} lang="en" dir="ltr">
              {font.name} (
              <a href={fontLicenseUrl(font.pkg)} {...EXTERNAL}>
                {t(ui.aboutFontLicense)}
              </a>
              )
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>{t(ui.aboutReviewTitle)}</h3>
        <p>{t(ui.aboutReview)}</p>
      </section>

      <section data-slot="version">
        <h3>{t(ui.aboutVersionTitle)}</h3>
        <UpdateStatus />
      </section>

      <section>
        <h3>{t(ui.aboutContactTitle)}</h3>
        <p>{t(ui.aboutContactHint)}</p>
        <ContactLinks />
      </section>
    </article>
  )
}
