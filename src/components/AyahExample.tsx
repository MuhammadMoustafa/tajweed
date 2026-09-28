import { useRef, useState } from 'react'
import { getVerseMarkup, verseAudioUrl } from '../data/quran'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import type { LessonExample } from '../lessons/types'
import type { RuleId } from '../tajweed/rules'
import { TajweedText } from './TajweedText'

interface Props {
  example: LessonExample
  highlight: readonly RuleId[]
}

export function AyahExample({ example, highlight }: Props) {
  const { t } = useLocale()
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const markup = getVerseMarkup(example.verseKey)

  // A missing verse means `npm run fetch-quran` wasn't run after editing a lesson.
  if (!markup) return null

  const toggle = () => {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  return (
    <figure className="card example">
      <TajweedText markup={markup} highlight={highlight} marks={example.marks} />
      <figcaption>
        <button type="button" className="play" onClick={toggle} aria-pressed={playing}>
          {playing ? '⏸ ' + t(ui.pause) : '▶ ' + t(ui.listen)}
        </button>
        <span className="verse-key">{example.verseKey}</span>
        <span>{t(example.note)}</span>
      </figcaption>
      <audio
        ref={audio}
        src={verseAudioUrl(example.verseKey)}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </figure>
  )
}
