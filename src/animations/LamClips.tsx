import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import type { WordKey } from '../lessons/types'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

/*
 * Lam clips (L11): one per section of the lam-rules lesson. Each shows single letters (mine, not
 * Quran text) laid out right to left, points at the lam and its neighbour, and ends by playing a
 * real word from a lesson example (text from the fetched data).
 */

const VIEW_W = 500
const VIEW_H = 260
const Y = 80
const WORD_Y = 215
const POINTER_Y = 135

const ALIF = 'ا'
const LAM = 'ل'
const SUKUN = 'ْ'
const SHADDA = 'ّ'

const X_ALIF = 380
const X_LAM = 300
const X_NEXT = 200

const TEXT = 'var(--text)'

interface PairProps {
  /** Text of the letter after the lam, with its harakat. */
  next: string
  /** The lam's opacity (1 = clear, low = silent). */
  lamOpacity?: number
  lamText?: string
  lamColor?: string
  nextColor?: string
  /** 0–1: how far the curved arrow from the lam into the next letter has been drawn. */
  arrow?: number
  /** 0–1: how far the sound rings around the lam have grown (qamariyyah). */
  rings?: number
  pointLam?: boolean
  pointNext?: boolean
  word?: WordKey
}

// eslint-disable-next-line react/only-export-components
function Pointer({ x, color }: { x: number; color: string }) {
  return <path d={`M${x - 9} ${POINTER_Y + 12} L${x} ${POINTER_Y} L${x + 9} ${POINTER_Y + 12} Z`} fill={color} />
}

/** The pair "alif + lam + next letter" as a frame; each step turns on the parts it is about. */
// eslint-disable-next-line react/only-export-components
function Pair({
  next,
  lamOpacity = 1,
  lamText = LAM,
  lamColor = TEXT,
  nextColor = TEXT,
  arrow = 0,
  rings = 0,
  pointLam,
  pointNext,
  word,
}: PairProps) {
  const wordText = word && getWord(word)?.text
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg lam-frame">
      <text x={X_ALIF} y={Y} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill={TEXT} opacity={0.6}>
        {ALIF}
      </text>
      {rings > 0 &&
        [0, 1].map((i) => {
          const grown = Math.min(1, Math.max(0, rings - i * 0.3) / 0.7)
          return (
            <circle
              key={i}
              cx={X_LAM}
              cy={Y}
              r={26 + 30 * grown}
              fill="none"
              stroke="var(--tj-laam-qamariyah)"
              strokeWidth={3}
              opacity={0.85 * (1 - grown * 0.7)}
            />
          )
        })}
      <text
        x={X_LAM}
        y={Y}
        textAnchor="middle"
        dominantBaseline="central"
        className="anim-letter"
        fill={lamColor}
        opacity={lamOpacity}
        data-lam
      >
        {lamText}
      </text>
      <text x={X_NEXT} y={Y} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill={nextColor} data-next>
        {next}
      </text>
      {arrow > 0 && (
        <path
          d={`M${X_LAM - 14} ${Y - 52} Q${(X_LAM + X_NEXT) / 2} ${Y - 92} ${X_NEXT + 14} ${Y - 52}`}
          fill="none"
          stroke="var(--tj-silent)"
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - arrow}
        />
      )}
      {pointLam && <Pointer x={X_LAM} color={lamColor} />}
      {pointNext && <Pointer x={X_NEXT} color={nextColor} />}
      {wordText && (
        <text x={VIEW_W / 2} y={WORD_Y} textAnchor="middle" dominantBaseline="central" className="anim-word" data-word={word}>
          {wordText}
        </text>
      )}
    </svg>
  )
}

const LISTEN_MS = 2200
const LISTEN_LABEL: Bilingual = { ar: 'استمع', en: 'Listen' }

const SUN = 'var(--tj-silent)'
const SUN_LABEL: Bilingual = { ar: 'اللام الشمسية', en: 'The sun lam' }
const SUN_NEXT = 'ر'
const SUN_NEXT_DOUBLE = `ر${SHADDA}`

/** Sun lam: look, the lam is silent, the next letter doubles, listen to a real word. */
export const lamShamsiyyah: Clip = {
  title: { ar: 'اللام الشمسية: لا تُنطق ويُشدَّد ما بعدها', en: 'The sun lam: not pronounced, the next letter is doubled' },
  steps: [
    {
      duration: 3000,
      label: SUN_LABEL,
      caption: {
        ar: 'بعد «أل» جاء حرف من الحروف الشمسية، وهنا الراء. انظر إلى اللام والحرف الذي بعدها.',
        en: 'After "al-" comes a sun letter, here ra. Look at the lam and the letter after it.',
      },
      render: () => <Pair next={SUN_NEXT} pointLam pointNext lamColor={SUN} />,
    },
    {
      duration: 3500,
      label: SUN_LABEL,
      caption: {
        ar: 'اللام لا تُنطق؛ تُكتب ولا تُلفظ، فننتقل مباشرة إلى الراء.',
        en: 'The lam is not pronounced: it is written but not said, so we go straight to the ra.',
      },
      render: (p) => <Pair next={SUN_NEXT} lamColor={SUN} lamOpacity={1 - 0.75 * p} arrow={p} pointLam />,
    },
    {
      duration: 3500,
      label: SUN_LABEL,
      caption: {
        ar: 'ويُشدَّد الحرف الذي بعدها: تُنطق الراء مرة واحدة مشدّدة، كأن اللام ذابت فيها.',
        en: 'The next letter carries a shadda: the ra is said once, doubled, as if the lam had melted into it.',
      },
      render: () => <Pair next={SUN_NEXT_DOUBLE} lamColor={SUN} lamOpacity={0.25} arrow={1} pointNext />,
    },
    {
      duration: LISTEN_MS,
      label: LISTEN_LABEL,
      caption: {
        ar: 'استمع إلى الكلمة الثالثة من البسملة: اللام مكتوبة ولا تُسمع، والراء مشدَّدة.',
        en: 'Hear the third word of the basmala: the lam is written but not heard, and the ra is doubled.',
      },
      audio: { word: CLIP_WORDS.lamShamsiyyah },
      render: () => (
        <Pair next={SUN_NEXT_DOUBLE} lamColor={SUN} lamOpacity={0.25} arrow={1} pointNext word={CLIP_WORDS.lamShamsiyyah} />
      ),
    },
  ] satisfies ClipStep[],
}

const MOON = 'var(--tj-laam-qamariyah)'
const MOON_LABEL: Bilingual = { ar: 'اللام القمرية', en: 'The moon lam' }
const MOON_NEXT = 'ح'
const MOON_LAM = `${LAM}${SUKUN}`

/** Moon lam: look, the lam sounds clearly, the next letter stays single, listen. */
export const lamQamariyyah: Clip = {
  title: { ar: 'اللام القمرية: تُنطق واضحة', en: 'The moon lam: pronounced clearly' },
  steps: [
    {
      duration: 3000,
      label: MOON_LABEL,
      caption: {
        ar: 'بعد «أل» جاء حرف من الحروف القمرية، وهنا الحاء. انظر إلى اللام وعليها سكون.',
        en: 'After "al-" comes a moon letter, here ha. Look at the lam, which carries a sukun.',
      },
      render: () => <Pair next={MOON_NEXT} lamText={MOON_LAM} lamColor={MOON} pointLam pointNext />,
    },
    {
      duration: 3500,
      label: MOON_LABEL,
      caption: {
        ar: 'تُنطق اللام واضحة ساكنة، وليست ضعيفة ولا مخفية.',
        en: 'The lam is pronounced clearly with its sukun, not weakened or hidden.',
      },
      render: (p) => <Pair next={MOON_NEXT} lamText={MOON_LAM} lamColor={MOON} rings={p} pointLam />,
    },
    {
      duration: 3000,
      label: MOON_LABEL,
      caption: {
        ar: 'والحرف الذي بعدها يبقى بغير تشديد: يُنطق كل حرف على حدة.',
        en: 'The letter after it has no shadda: each letter is said on its own.',
      },
      render: () => <Pair next={MOON_NEXT} lamText={MOON_LAM} lamColor={MOON} rings={1} pointNext />,
    },
    {
      duration: LISTEN_MS,
      label: LISTEN_LABEL,
      caption: {
        ar: 'استمع إلى أول كلمة في الآية الثانية من الفاتحة: تسمع اللام واضحة.',
        en: 'Hear the first word of the second ayah of al-Fatiha: the lam is clearly heard.',
      },
      audio: { word: CLIP_WORDS.lamQamariyyah },
      render: () => (
        <Pair next={MOON_NEXT} lamText={MOON_LAM} lamColor={MOON} rings={1} pointLam word={CLIP_WORDS.lamQamariyyah} />
      ),
    },
  ] satisfies ClipStep[],
}

const HEAVY = 'var(--tj-tafkheem)'
const LIGHT = 'var(--tj-tarqeeq)'
const ALLAH_LAM = `${LAM}${SHADDA}`

interface AllahProps {
  before: string
  heavy: boolean
  tag: Bilingual
  word?: WordKey
}

/** A syllable with its harakah, then the lam drawn big and dark (heavy) or small and pale (light). */
// eslint-disable-next-line react/only-export-components
function AllahFrame({ before, heavy, tag, word }: AllahProps) {
  const { t } = useLocale()
  const color = heavy ? HEAVY : LIGHT
  const size = heavy ? 84 : 52
  const wordText = word && getWord(word)?.text
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg lam-frame">
      <text x={340} y={Y} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill={TEXT} data-before>
        {before}
      </text>
      <text
        x={230}
        y={Y}
        textAnchor="middle"
        dominantBaseline="central"
        className="anim-letter"
        fill={color}
        style={{ fontSize: size }}
        data-allah-lam={heavy ? 'heavy' : 'light'}
      >
        {ALLAH_LAM}
      </text>
      <Pointer x={230} color={color} />
      <Pointer x={340} color={TEXT} />
      <text x={VIEW_W / 2} y={POINTER_Y + 45} textAnchor="middle" className="lam-tag" fill={color}>
        {t(tag)}
      </text>
      {wordText && (
        <text x={VIEW_W / 2} y={WORD_Y} textAnchor="middle" dominantBaseline="central" className="anim-word" data-word={word}>
          {wordText}
        </text>
      )}
    </svg>
  )
}

const HEAVY_TAG: Bilingual = { ar: 'مفخَّمة: يمتلئ الفم', en: 'Heavy: the mouth fills' }
const LIGHT_TAG: Bilingual = { ar: 'مرقَّقة: يخفّ الصوت', en: 'Light: the sound stays thin' }

/** Lam of Allah: heavy after a fatha or damma, light after a kasra, then one real word of each. */
export const lamAllah: Clip = {
  title: {
    ar: 'لام اسم الله: تفخيم بعد الفتحة والضمة، وترقيق بعد الكسرة',
    en: 'The lam of Allah: heavy after fatha or damma, light after kasra',
  },
  steps: [
    {
      duration: 3000,
      label: { ar: 'بعد فتحة', en: 'After a fatha' },
      caption: {
        ar: 'إذا سبقت اللام فتحة فهي مفخَّمة: تُنطق غليظة ممتلئة.',
        en: 'When a fatha comes before the lam, it is heavy: said full and thick.',
      },
      render: () => <AllahFrame before="بَ" heavy tag={HEAVY_TAG} />,
    },
    {
      duration: 3000,
      label: { ar: 'بعد ضمة', en: 'After a damma' },
      caption: {
        ar: 'وكذلك إذا سبقتها ضمة: تبقى مفخَّمة.',
        en: 'The same after a damma: it stays heavy.',
      },
      render: () => <AllahFrame before="بُ" heavy tag={HEAVY_TAG} />,
    },
    {
      duration: 3000,
      label: { ar: 'بعد كسرة', en: 'After a kasra' },
      caption: {
        ar: 'أما إذا سبقتها كسرة فهي مرقَّقة: تُنطق خفيفة رقيقة.',
        en: 'But when a kasra comes before the lam, it is light: said thin and soft.',
      },
      render: () => <AllahFrame before="بِ" heavy={false} tag={LIGHT_TAG} />,
    },
    {
      duration: LISTEN_MS,
      label: LISTEN_LABEL,
      caption: {
        ar: 'استمع إلى اللام المفخَّمة بعد فتحة في الآية الأولى من سورة الإخلاص.',
        en: 'Hear the heavy lam after a fatha in the first ayah of surat al-Ikhlas.',
      },
      audio: { word: CLIP_WORDS.lamAllahHeavy },
      render: () => <AllahFrame before="بَ" heavy tag={HEAVY_TAG} word={CLIP_WORDS.lamAllahHeavy} />,
    },
    {
      duration: LISTEN_MS,
      label: LISTEN_LABEL,
      caption: {
        ar: 'واستمع إلى اللام المرقَّقة بعد كسرة في البسملة.',
        en: 'And hear the light lam after a kasra in the basmala.',
      },
      audio: { word: CLIP_WORDS.lamAllahLight },
      render: () => <AllahFrame before="بِ" heavy={false} tag={LIGHT_TAG} word={CLIP_WORDS.lamAllahLight} />,
    },
  ] satisfies ClipStep[],
}
