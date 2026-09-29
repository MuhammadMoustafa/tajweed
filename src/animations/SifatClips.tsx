import type { ReactNode } from 'react'
import type { Bilingual } from '../i18n/bilingual'
import { Localized } from '../i18n/LocaleProvider'
import { LETTER_NAMES, type ArabicLetter } from '../tajweed/letters'
import { LETTER_MS, letterInTurn, letterTourFrame, phasesOf } from './MakharijClips'
import { makhrajOfLetter } from './mouth/makharij'
import { MouthDiagram, type MouthDiagramProps } from './mouth/MouthDiagram'
import { regionPoint } from './mouth/regions'
import { LETTER_SIFAT, lettersWith, OPPOSITE_SIFAT, SIFAT, SINGLE_SIFAT, type SifahId } from './mouth/sifat'
import type { Clip, ClipStep } from './player/clip'

/*
 * The sifat lesson's clips (L20): one per section, each step one quality. A quality with a
 * mnemonic shows its letters one at a time (the diagram lighting that letter's makhraj), then all
 * together; "the rest of the letters" (the other side of a pair) are shown at once. Over the
 * MouthDiagram an overlay shows what the quality does: breath or sound flowing or stopped, the
 * tongue raised or sealed, a whistle, an echo. Drawn in the diagram's head coordinates.
 */

type Point = readonly [number, number]

/** The path breath and sound take: up the throat, along the mouth between tongue and palate, out past the lips. */
const FLOW: readonly Point[] = [
  [201, 300],
  [201, 240],
  [201, 190],
  [196, 172],
  [180, 164],
  [160, 160],
  [135, 153],
  [110, 151],
  [85, 154],
  [66, 166],
  [50, 168.5],
  [16, 171],
]

const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1])

/** The first `fraction` (0–1) of a polyline, by length. */
function partial(points: readonly Point[], fraction: number): Point[] {
  const lengths = points.slice(1).map((p, i) => dist(points[i], p))
  let left = Math.min(Math.max(fraction, 0), 1) * lengths.reduce((a, b) => a + b, 0)
  const out: Point[] = [points[0]]
  for (let i = 0; i < lengths.length; i++) {
    if (left >= lengths[i]) {
      out.push(points[i + 1])
      left -= lengths[i]
      continue
    }
    const t = lengths[i] === 0 ? 0 : left / lengths[i]
    const [a, b] = [points[i], points[i + 1]]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    break
  }
  return out
}

/** FLOW split at its point nearest `target`: the part up to it and the part after it. */
function splitNear(target: Point): [Point[], Point[]] {
  let best = 0
  FLOW.forEach((p, i) => {
    if (dist(p, target) < dist(FLOW[best], target)) best = i
  })
  return [FLOW.slice(0, best + 1), FLOW.slice(best)]
}

const pointsAttr = (points: readonly Point[]) => points.map(([x, y]) => `${x},${y}`).join(' ')

/** A small arrowhead at `to`, pointing away from `from`. */
function arrowHead(from: Point, to: Point, className: string): ReactNode {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0])
  const corner = (turn: number): string =>
    `${to[0] - 9 * Math.cos(angle + turn)},${to[1] - 9 * Math.sin(angle + turn)}`
  return <polygon points={`${to[0]},${to[1]} ${corner(0.45)} ${corner(-0.45)}`} className={className} />
}

/** A polyline with an arrowhead at its end (nothing while it has no length yet). */
function arrow(points: readonly Point[], line: string, head: string, key?: string): ReactNode {
  if (points.length < 2) return null
  const [from, to] = points.slice(-2)
  if (dist(from, to) === 0) return null
  return (
    <g key={key}>
      <polyline points={pointsAttr(points)} className={`${line} sifat-halo`} />
      <polyline points={pointsAttr(points)} className={line} />
      {arrowHead(from, to, head)}
    </g>
  )
}

/** A short bar across the end of `points`: the sound or breath stops here. */
function barrier(points: readonly Point[]): ReactNode {
  const at = points[points.length - 1]
  // A path that never left its start (a letter from the deepest throat) runs upward there.
  const from: Point = points.length > 1 ? points[points.length - 2] : [at[0], at[1] + 1]
  const angle = Math.atan2(at[1] - from[1], at[0] - from[0]) + Math.PI / 2
  const dx = 10 * Math.cos(angle)
  const dy = 10 * Math.sin(angle)
  return <line x1={at[0] - dx} y1={at[1] - dy} x2={at[0] + dx} y2={at[1] + dy} className="sifat-barrier" />
}

/** Where a letter's own makhraj is drawn; the middle of the tongue stands in for "any letter". */
const makhrajPoint = (letter?: ArabicLetter): Point =>
  regionPoint(letter ? makhrajOfLetter(letter).regions[0] : 'tongue-middle')

const breath = (points: readonly Point[], key?: string) => arrow(points, 'sifat-breath', 'sifat-breath-head', key)
const sound = (points: readonly Point[], key?: string) => arrow(points, 'sifat-sound', 'sifat-sound-head', key)

/** Part of a phase spent drawing a path that then stops; the rest shows the stop. */
const DRAW = 0.6

/** Sound running to the letter's makhraj and stopping there (shiddah). */
function stopped(letter: ArabicLetter | undefined, local: number): ReactNode {
  const [upTo] = splitNear(makhrajPoint(letter))
  return (
    <>
      {sound(partial(upTo, local / DRAW))}
      {local >= DRAW && barrier(upTo)}
    </>
  )
}

/** Arcs growing out of `at`, one after another (voice in the throat, a whistle, an echo). */
function rings(at: Point, local: number, radii: readonly number[], className: string, arc?: 'left' | 'right'): ReactNode {
  return radii.map((r, i) => {
    if (local < i / radii.length) return null
    if (!arc) return <circle key={r} cx={at[0]} cy={at[1]} r={r} className={className} />
    const dir = arc === 'left' ? -1 : 1
    const d = `M${at[0] + dir * r * 0.5} ${at[1] - r} Q${at[0] + dir * r * 1.2} ${at[1]} ${at[0] + dir * r * 0.5} ${at[1] + r}`
    return <path key={r} d={d} className={className} />
  })
}

interface Visual {
  tongue?: MouthDiagramProps['tongue']
  draw?: (letter: ArabicLetter | undefined, local: number) => ReactNode
}

/** What each quality looks like on the diagram, given the letter shown (if one) and how far into its phase. */
const VISUALS: Record<SifahId, Visual> = {
  // Breath keeps flowing out past the lips.
  hams: { draw: (_letter, local) => breath(partial(FLOW, local)) },
  // Breath held back low in the throat, while the voice vibrates there.
  jahr: {
    draw: (_letter, local) => {
      const held = FLOW.slice(0, 2)
      return (
        <>
          {breath(partial(held, local / DRAW))}
          {local >= DRAW && barrier(held)}
          {rings([214, 230], local, [8, 14, 20], 'sifat-voice', 'right')}
        </>
      )
    },
  },
  shiddah: { draw: stopped },
  // Sound reaches the makhraj, then only part of it runs on (dotted).
  tawassut: {
    draw: (letter, local) => {
      const [upTo, after] = splitNear(makhrajPoint(letter))
      return (
        <>
          {sound(partial(upTo, local / DRAW))}
          {local >= DRAW && <polyline points={pointsAttr(partial(after, (local - DRAW) / (1 - DRAW)))} className="sifat-sound-partly" />}
        </>
      )
    },
  },
  rakhawah: { draw: (_letter, local) => sound(partial(FLOW, local)) },
  istila: {
    tongue: 'raised-back',
    draw: (_letter, local) => sound(partial([[168, 206], [168, 164]], local)),
  },
  istifal: { draw: (_letter, local) => sound(partial([[168, 150], [168, 194]], local)) },
  itbaq: {
    tongue: 'sealed',
    draw: (_letter, local) => (
      <>
        {sound(partial([[100, 196], [100, 164]], local), 'a')}
        {sound(partial([[135, 204], [135, 166]], local), 'b')}
      </>
    ),
  },
  // Air passes freely in the gap between tongue and palate.
  infitah: { draw: (_letter, local) => breath(partial(FLOW, local)) },
  idhlaq: {},
  ismat: {},
  safir: { draw: (_letter, local) => rings([34, 170], local, [6, 11, 16], 'sifat-voice', 'left') },
  qalqalah: { draw: (letter, local) => rings(makhrajPoint(letter), local, [8, 14], 'sifat-echo') },
  lin: { draw: (_letter, local) => breath(partial(FLOW, local)) },
  // Lam leans toward the tip of the tongue; ra toward its top.
  inhiraf: {
    draw: (letter, local) =>
      sound(
        partial(
          letter === 'ر'
            ? [
                [70, 172],
                [95, 166],
                [120, 164],
              ]
            : [
                [120, 176],
                [95, 180],
                [72, 180],
              ],
          local,
        ),
      ),
  },
  // One tap of the tip on the gum ridge, no trill.
  takrir: { draw: (_letter, local) => sound(partial([[76, 170], [70, 152]], local)) },
  // Air spreading through the mouth from the middle of the tongue.
  tafashshi: {
    draw: (_letter, local) =>
      (
        [
          [78, 158],
          [96, 148],
          [118, 146],
          [140, 149],
          [158, 156],
        ] as const
      ).map((end, i) => breath(partial([[120, 162], end], local), String(i))),
  },
  // Sound stretching along the side of the tongue, back to front.
  istitalah: {
    draw: (_letter, local) =>
      sound(
        partial(
          [
            [152, 178],
            [130, 174],
            [105, 175],
            [82, 182],
          ],
          local,
        ),
      ),
  },
}

const REST: Bilingual = { ar: 'بقية الحروف', en: 'The rest of the letters' }
/** How long a step showing "the rest of the letters" at once stays up, in ms. */
const REST_MS = 6000
/** The shortest step, so a one-letter quality still leaves time to read its caption. */
const MIN_STEP_MS = 4400

/** One quality: its letters in turn (with a mnemonic) or all at once (the rest). */
export function sifahStep(id: SifahId): ClipStep {
  const sifah = SIFAT[id]
  const visual = VISUALS[id]
  const letters = lettersWith(id)
  const inTurn = sifah.mnemonic ? letters.length : 0
  return {
    duration: inTurn ? Math.max(MIN_STEP_MS, phasesOf(inTurn) * LETTER_MS) : REST_MS,
    caption: sifah.meaning,
    label: sifah.name,
    render: (progress) => {
      const { current, local } = letterInTurn(inTurn, progress)
      const letter = current === undefined ? undefined : letters[current]
      return letterTourFrame({
        heading: sifah.name,
        highlight: sifah.regions ?? (letter ? makhrajOfLetter(letter).regions : []),
        tongue: visual.tongue,
        overlay: visual.draw?.(letter, local),
        letters,
        current,
        names: letter ? LETTER_NAMES[letter] : sifah.mnemonic ? { ar: sifah.mnemonic, en: sifah.mnemonic } : REST,
      })
    },
  }
}

const sifatClip = (title: Bilingual, ids: readonly SifahId[]): Clip => ({ title, steps: ids.map(sifahStep) })

export const sifatHamsJahr = sifatClip({ ar: 'الهمس والجهر', en: 'Hams and jahr' }, OPPOSITE_SIFAT[0])
export const sifatShiddahRakhawah = sifatClip(
  { ar: 'الشدة والتوسط والرخاوة', en: 'Shiddah, tawassut and rakhawah' },
  OPPOSITE_SIFAT[1],
)
export const sifatIstilaIstifal = sifatClip({ ar: 'الاستعلاء والاستفال', en: 'Istiʿla and istifal' }, OPPOSITE_SIFAT[2])
export const sifatItbaqInfitah = sifatClip({ ar: 'الإطباق والانفتاح', en: 'Itbaq and infitah' }, OPPOSITE_SIFAT[3])
export const sifatIdhlaqIsmat = sifatClip({ ar: 'الإذلاق والإصمات', en: 'Idhlaq and ismat' }, OPPOSITE_SIFAT[4])
export const sifatSafirQalqalahLin = sifatClip({ ar: 'الصفير والقلقلة واللين', en: 'Safir, qalqalah and lin' }, SINGLE_SIFAT.slice(0, 3))
export const sifatInhirafIstitalah = sifatClip(
  { ar: 'الانحراف والتكرير والتفشي والاستطالة', en: 'Inhiraf, takrir, tafashshi and istitalah' },
  SINGLE_SIFAT.slice(3),
)

/** Letters that share a makhraj and are told apart only by their qualities. */
export const LOOK_ALIKES: readonly { letters: readonly [ArabicLetter, ArabicLetter]; caption: Bilingual }[] = [
  {
    letters: ['ت', 'ط'],
    caption: {
      ar: 'التاء والطاء من مخرج واحد. التاء مهموسة مستفلة منفتحة، والطاء مجهورة مستعلية مطبقة مقلقلة؛ فبالصفات يتميز أحدهما عن الآخر.',
      en: 'Ta and ṭa share one makhraj. Ta is whispered, low and open; ṭa is voiced, raised, sealed and has qalqalah. Their qualities are what tell them apart.',
    },
  },
  {
    letters: ['س', 'ص'],
    caption: {
      ar: 'السين والصاد من مخرج واحد، وكلاهما مهموس رخو فيه صفير. لكن الصاد مستعلية مطبقة، والسين مستفلة منفتحة.',
      en: 'Seen and ṣad share one makhraj, and both are whispered, soft and whistling. But ṣad is raised and sealed, while seen is low and open.',
    },
  },
  {
    letters: ['ذ', 'ظ'],
    caption: {
      ar: 'الذال والظاء من مخرج واحد، وكلاهما مجهور رخو. لكن الظاء مستعلية مطبقة، والذال مستفلة منفتحة.',
      en: 'Dhal and ẓa share one makhraj, and both are voiced and soft. But ẓa is raised and sealed, while dhal is low and open.',
    },
  },
  {
    letters: ['ء', 'ه'],
    caption: {
      ar: 'الهمزة والهاء من أقصى الحلق. الهمزة مجهورة شديدة ينحبس معها الصوت، والهاء مهموسة رخوة يجري معها النفس.',
      en: 'Hamzah and ha both come from the deepest part of the throat. Hamzah is voiced and strong, and the sound stops; ha is whispered and soft, and the breath flows.',
    },
  },
]

const COMPARE_MS = 3 * LETTER_MS

/** The two letters' qualities side by side; the ones they do not share are marked (bold, not only colored). */
function compareFrame([a, b]: readonly [ArabicLetter, ArabicLetter], current: number | undefined) {
  const makhraj = makhrajOfLetter(a)
  return (
    <div className="makharij-tour">
      <MouthDiagram highlight={makhraj.regions} labels={makhraj.regions} />
      <div className="sifat-compare">
        {[a, b].map((letter, i) => {
          const other = LETTER_SIFAT[i === 0 ? b : a]
          return (
            <div
              key={letter}
              className="sifat-compare-letter"
              data-letter={letter}
              data-current={current === undefined || current === i ? true : undefined}
            >
              <span className="makharij-letters" lang="ar" dir="rtl">
                <span className="makharij-letter" data-current>
                  {letter}
                </span>
              </span>
              <strong>
                <Localized text={LETTER_NAMES[letter]} />
              </strong>
              <ul>
                {LETTER_SIFAT[letter].map((id) => (
                  <li key={id} data-sifah={id} data-differs={!other.includes(id) || undefined}>
                    {other.includes(id) ? <Localized text={SIFAT[id].name} /> : <strong><Localized text={SIFAT[id].name} /></strong>}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Look-alike letters (one makhraj, different qualities): each letter's qualities, then both side by side. */
export const sifatCompare: Clip = {
  title: { ar: 'حروف من مخرج واحد', en: 'Letters from one makhraj' },
  steps: LOOK_ALIKES.map(
    ({ letters, caption }): ClipStep => ({
      duration: COMPARE_MS,
      caption,
      label: {
        ar: `${LETTER_NAMES[letters[0]].ar} و${LETTER_NAMES[letters[1]].ar}`,
        en: `${LETTER_NAMES[letters[0]].en} and ${LETTER_NAMES[letters[1]].en.toLowerCase()}`,
      },
      render: (progress) => compareFrame(letters, letterInTurn(2, progress).current),
    }),
  ),
}
