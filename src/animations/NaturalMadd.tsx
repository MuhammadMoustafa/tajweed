import { MaddBar } from './MaddBar'

/** The three madd letters, each preceded by its matching harakah, stretching to 2 counts. */
const LETTERS = [
  { letter: 'ـَا', label: { ar: 'ألف بعد فتحة', en: 'Alif after fatha' } },
  { letter: 'ـُو', label: { ar: 'واو ساكنة بعد ضمة', en: 'Waw sukun after damma' } },
  { letter: 'ـِي', label: { ar: 'ياء ساكنة بعد كسرة', en: 'Ya sukun after kasra' } },
]

/** Natural madd (al-madd al-tabi'i): the three madd letters, each stretched 2 counts. */
export function NaturalMadd() {
  return (
    <div className="madd-row">
      {LETTERS.map(({ letter, label }) => (
        <MaddBar key={letter} counts={2} letter={letter} label={label} />
      ))}
    </div>
  )
}
