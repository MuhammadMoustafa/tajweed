import { APP_VERSION } from '../about/version'
import { QURAN_SOURCE, QURAN_WORDS_SOURCE, SURAHS_SOURCE, WORD_RECITATION } from '../data/quran'
import { getMatnMeta, MUTOON_SOURCE } from '../data/mutoon'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
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
  const { t } = useLocale()
  const sources = [QURAN_SOURCE, QURAN_WORDS_SOURCE, SURAHS_SOURCE]
  return (
    <article className="about-page">
      <h2>{t(ui.aboutTitle)}</h2>

      <section>
        <h3>{t(ui.aboutWhatTitle)}</h3>
        <p>{t(ui.aboutWhat)}</p>
      </section>

      <section>
        <h3>{t(ui.aboutSourcesTitle)}</h3>
        <p>{t(ui.aboutQuranText)}</p>
        <ul>
          {sources.map((source) => (
            <li key={source.name} lang="en" dir="ltr">
              <a href={QURAN_FOUNDATION_URL} {...EXTERNAL}>
                {source.name}
              </a>
            </li>
          ))}
        </ul>
        <p>
          {t(ui.aboutAyahAudio)}{' '}
          <a href={EVERYAYAH_URL} {...EXTERNAL}>
            EveryAyah
          </a>
        </p>
        <p>
          {t(ui.aboutWordAudio)} ({t(WORD_RECITATION.reciter)})
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
        <p>
          {t(ui.aboutVersion)}: <span dir="ltr">{APP_VERSION}</span>
        </p>
        {/* T27's update component (the APK's update check) goes here. */}
        <div data-slot="update" />
      </section>

      <section>
        <h3>{t(ui.aboutContactTitle)}</h3>
        <p>{t(ui.aboutContactHint)}</p>
        <ContactLinks />
      </section>
    </article>
  )
}
