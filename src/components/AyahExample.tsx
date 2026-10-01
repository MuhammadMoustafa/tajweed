import { useRef, useState } from 'react'
import { getVerseMarkup, surahName, verseAudioUrl } from '../data/quran'
import { useLocale } from '../i18n/LocaleProvider'
import { formatTemplate, ui } from '../i18n/ui'
import type { LessonExample } from '../lessons/types'
import type { RuleId } from '../tajweed/rules'
import { TajweedText } from './TajweedText'

interface Props {
  example: LessonExample
  highlight: readonly RuleId[]
}

export function AyahExample({ example, highlight }: Props) {
  const { locale, t } = useLocale()
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const markup = getVerseMarkup(example.verseKey)

  const [surah, ayah] = example.verseKey.split(':').map(Number)
  // A missing verse means `npm run fetch-quran` wasn't run after editing a lesson.
  if (!markup) return null

  const fail = () => {
    setPlaying(false)
    setFailed(true)
  }

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) {
      // After a failed load the element stays in its error state: start the download again.
      if (el.error) el.load()
      // Offline before the ayah is cached, or playback blocked: play() rejects.
      el.play().catch(fail)
    } else el.pause()
  }

  return (
    <figure className="card example">
      <TajweedText markup={markup} highlight={highlight} marks={example.marks} />
      <figcaption>
        <button type="button" className="play" onClick={toggle} aria-pressed={playing}>
          {playing ? '⏸ ' + t(ui.pause) : '▶ ' + t(ui.listen)}
        </button>
        <span className="verse-key" data-verse-key={example.verseKey}>
          {formatTemplate(locale, ui.verseRef, { surah: t(surahName(surah)), number: surah, ayah })}
        </span>
        {failed && (
          <span role="alert" className="audio-error">
            {t(ui.audioFailed)}
          </span>
        )}
        <span>{t(example.note)}</span>
      </figcaption>
      <audio
        ref={audio}
        src={verseAudioUrl(example.verseKey)}
        preload="none"
        onPlay={() => {
          setPlaying(true)
          setFailed(false)
        }}
        onError={fail}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </figure>
  )
}
