import { LETTER_WORDS } from '../animations/words'
import type { Bilingual } from '../i18n/bilingual'
import type { WordKey } from '../lessons/types'
import { splitGraphemes } from '../tajweed/graphemes'
import { writesLetter, type ArabicLetter } from '../tajweed/letters'
import { LETTER_IDS, letterNameOf } from './ids'

/**
 * The letters page (#/letters): one card per letter, in LETTER_NAMES order (the makharij data's
 * letters: hamzah and the madd alif come from different makharij, so each has its own card). A
 * card's makhraj comes from src/animations/mouth/makharij.ts, its qualities from
 * src/animations/mouth/sifat.ts and its word from LETTER_WORDS (src/animations/words.ts); only the
 * beginner's tip lives here, Arabic and English side by side. Not a lesson: no unit, quiz or
 * progress. React-free data; single letters, not Quran text.
 */
export interface LetterCard {
  /** URL slug: #/letters/<id>, from LETTER_IDS (ids.ts). */
  id: string
  letter: ArabicLetter
  /** How to say it well, and the mistake to avoid, in a sentence or two. */
  tip: Bilingual
}

/** Set true only after a qualified teacher has checked every card in both languages. */
export const LETTERS_REVIEWED = false

const CARDS: readonly Omit<LetterCard, 'id'>[] = [
  {
    letter: 'ء',
    tip: {
      ar: 'نبرة واضحة من أقصى الحلق، تُنطق بلا تكلّف ولا شدّة زائدة، فلا تجعلها عينًا ولا تُسهّلها.',
      en: 'A clear catch of the voice from the deepest part of the throat. Say it cleanly, without forcing it, and never soften it or turn it into an ʿayn.',
    },
  },
  {
    letter: 'ا',
    tip: {
      ar: 'الألف حرف مدّ دائمًا: ساكنة، وما قبلها مفتوح، ولا تقبل الحركة. تُمدّ حركتين في المد الطبيعي، وتتبع ما قبلها تفخيمًا وترقيقًا.',
      en: 'Alif is always a madd letter: it has a sukun, comes after a fatha and never carries a vowel. It is held for two counts in natural madd, and is heavy or light like the letter before it.',
    },
  },
  {
    letter: 'ب',
    tip: {
      ar: 'تنطبق الشفتان انطباقًا محكمًا ثم تنفتحان. هي مجهورة، فلا تهمسها، وإذا سكنت قُلقلت.',
      en: 'Close both lips firmly, then open them. It is voiced, so never whisper it into a p; with a sukun it has qalqalah.',
    },
  },
  {
    letter: 'ت',
    tip: {
      ar: 'حرف مرقّق مهموس يجري معه نَفَس خفيف، وخاصة إذا سكن. لا تفخّمها فتشبه الطاء.',
      en: 'A light, whispered letter: a little breath follows it, especially with a sukun. Do not make it heavy, or it sounds like ṭa.',
    },
  },
  {
    letter: 'ث',
    tip: {
      ar: 'يلتقي طرف اللسان بأطراف الثنايا العليا مع نَفَس خفيف، فلا تبدلها سينًا ولا تاءً.',
      en: 'The tip of the tongue meets the edges of the upper front teeth, with a light breath, like the th in "think". Do not turn it into s or t.',
    },
  },
  {
    letter: 'ج',
    tip: {
      ar: 'تُنطق شديدة مجهورة، فلا تُرخِها حتى تشبه الشين المجهورة، وإذا سكنت قُلقلت.',
      en: 'Say it firmly and voiced, never softened like the s in "measure"; with a sukun it has qalqalah.',
    },
  },
  {
    letter: 'ح',
    tip: {
      ar: 'صوت مهموس صافٍ من وسط الحلق، أقوى من الهاء، فلا تخلطها بالهاء ولا بالخاء.',
      en: 'A clear, breathy sound from the middle of the throat, stronger than ha. Keep it apart from ha and from kha.',
    },
  },
  {
    letter: 'خ',
    tip: {
      ar: 'صوت مفخّم من أدنى الحلق، يبقى مفخّمًا دائمًا، وأقلّ ما يكون تفخيمه مع الكسر.',
      en: 'A heavy, rough sound from the nearest part of the throat. It is always heavy, least so with a kasra.',
    },
  },
  {
    letter: 'د',
    tip: {
      ar: 'مجهورة شديدة مرقّقة، وإذا سكنت قُلقلت. لا تفخّمها فتشبه الضاد.',
      en: 'Voiced, firm and light; with a sukun it has qalqalah. Do not make it heavy, or it sounds like ḍad.',
    },
  },
  {
    letter: 'ذ',
    tip: {
      ar: 'من مخرج الثاء لكنها مجهورة، فلا تبدلها زايًا ولا دالًا.',
      en: 'From the same place as tha, but voiced, like the th in "this". Do not turn it into z or d.',
    },
  },
  {
    letter: 'ر',
    tip: {
      ar: 'يطرق طرف اللسان اللثة طرقة واحدة بلا ترعيد، وتُفخّم أو تُرقّق بحسب حركتها وما قبلها، كما في درس الراء.',
      en: 'The tip of the tongue taps the gums once, without trilling. It is heavy or light depending on its vowel and what comes before it, as the ra lesson explains.',
    },
  },
  {
    letter: 'ز',
    tip: {
      ar: 'حرف صفير مجهور، فأظهر صفيرها ولا تبدلها ذالًا.',
      en: 'A voiced letter with a whistle. Let the whistle be heard, and do not turn it into dhal.',
    },
  },
  {
    letter: 'س',
    tip: {
      ar: 'حرف صفير مهموس مرقّق، فلا تفخّمها فتصير صادًا.',
      en: 'A light, whispered letter with a whistle. Do not make it heavy, or it becomes ṣad.',
    },
  },
  {
    letter: 'ش',
    tip: {
      ar: 'ينتشر الهواء في الفم عند نطقها، وهي مرقّقة مهموسة.',
      en: 'The air spreads through the mouth as you say it; it is light and whispered.',
    },
  },
  {
    letter: 'ص',
    tip: {
      ar: 'حرف صفير مفخّم: يرتفع اللسان إلى الحنك وينطبق عليه، فلا ترقّقها فتصير سينًا.',
      en: 'A heavy letter with a whistle: the tongue rises and seals against the palate. Do not make it light, or it becomes seen.',
    },
  },
  {
    letter: 'ض',
    tip: {
      ar: 'تعتمد حافة اللسان على الأضراس العليا ويمتد الصوت على طولها، وهي مفخّمة، فلا تجعلها دالًا مفخّمة ولا ظاءً.',
      en: 'The side of the tongue presses on the upper molars and the sound runs along it. It is heavy; do not turn it into a heavy d or into ẓa.',
    },
  },
  {
    letter: 'ط',
    tip: {
      ar: 'أقوى الحروف تفخيمًا: ينطبق اللسان على الحنك، وإذا سكنت قُلقلت. لا ترقّقها فتصير تاءً.',
      en: 'The heaviest letter: the tongue seals against the palate, and with a sukun it has qalqalah. Do not make it light, or it becomes ta.',
    },
  },
  {
    letter: 'ظ',
    tip: {
      ar: 'من مخرج الذال لكنها مفخّمة مطبقة، فلا تبدلها زايًا ولا ضادًا.',
      en: 'From the same place as dhal, but heavy, with the tongue sealed against the palate. Do not turn it into z or ḍad.',
    },
  },
  {
    letter: 'ع',
    tip: {
      ar: 'من وسط الحلق، مجهورة، وصوتها بين الانحباس والجريان، فلا تبدلها همزة.',
      en: 'From the middle of the throat, voiced, with a sound between stopping and flowing. Do not turn it into a hamzah.',
    },
  },
  {
    letter: 'غ',
    tip: {
      ar: 'صوت مجهور مفخّم من أدنى الحلق، أقلّ ما يكون تفخيمه مع الكسر، فلا تخلطه بالخاء.',
      en: 'A voiced, heavy sound from the nearest part of the throat, least heavy with a kasra. Keep it apart from kha, which is whispered.',
    },
  },
  {
    letter: 'ف',
    tip: {
      ar: 'يلتقي بطن الشفة السفلى بأطراف الثنايا العليا، ويجري معها نَفَس خفيف.',
      en: 'The inside of the lower lip meets the edges of the upper front teeth, and a light breath flows with it.',
    },
  },
  {
    letter: 'ق',
    tip: {
      ar: 'من أقصى اللسان، مفخّمة، وإذا سكنت قُلقلت. لا تبدلها كافًا ولا همزة.',
      en: 'From the back of the tongue, heavy; with a sukun it has qalqalah. Do not turn it into kaf or a hamzah.',
    },
  },
  {
    letter: 'ك',
    tip: {
      ar: 'أسفل من مخرج القاف قليلًا، مرقّقة، ويجري معها نَفَس خفيف.',
      en: 'A little further forward than qaf, light, with a small breath after it.',
    },
  },
  {
    letter: 'ل',
    tip: {
      ar: 'مرقّقة دائمًا، إلا لام لفظ الجلالة بعد فتح أو ضم فتُفخّم.',
      en: 'Always light, except the lam in the name of Allah after a fatha or a damma, which is heavy.',
    },
  },
  {
    letter: 'م',
    tip: {
      ar: 'تنطبق الشفتان، وتصحبها غنة أظهر ما تكون إذا شُدّدت.',
      en: 'Close both lips. A ghunnah (nasal hum) goes with it, fullest when it has a shaddah.',
    },
  },
  {
    letter: 'ن',
    tip: {
      ar: 'من طرف اللسان مع لثة الثنايا العليا، وتصحبها غنة أظهر ما تكون إذا شُدّدت.',
      en: 'The tip of the tongue at the gums of the upper front teeth. A ghunnah goes with it, fullest when it has a shaddah.',
    },
  },
  {
    letter: 'ه',
    tip: {
      ar: 'نَفَس خفيف من أقصى الحلق، فأظهرها ولا تُخفِها، وخاصة إذا سكنت أو جاءت في آخر الكلمة.',
      en: 'A light breath from the deepest part of the throat. Let it be heard, especially with a sukun or at the end of a word.',
    },
  },
  {
    letter: 'و',
    tip: {
      ar: 'تنضمّ الشفتان دون انطباق. فإذا سكنت بعد ضم صارت حرف مدّ يخرج من الجوف.',
      en: 'Round the lips without closing them. With a sukun after a damma it is a madd letter instead, from the jawf.',
    },
  },
  {
    letter: 'ي',
    tip: {
      ar: 'يرتفع وسط اللسان إلى وسط الحنك. فإذا سكنت بعد كسر صارت حرف مدّ يخرج من الجوف.',
      en: 'The middle of the tongue rises to the middle of the palate. With a sukun after a kasra it is a madd letter instead, from the jawf.',
    },
  },
]

export const LETTER_CARDS: readonly LetterCard[] = CARDS.map((card) => ({ id: LETTER_IDS[card.letter], ...card }))

export const findLetterCard = (id: string): LetterCard | undefined => LETTER_CARDS.find((card) => card.id === id)

/** Every letter has a card (letters.test.ts). */
export const cardOf = (letter: ArabicLetter): LetterCard => LETTER_CARDS.find((card) => card.letter === letter)!

/** The letter's name in both languages (from LETTER_NAMES). */
export const letterName = (card: LetterCard): Bilingual => letterNameOf(card.letter)

/** The Quran word the card plays (LETTER_WORDS). */
export const letterWord = (card: LetterCard): WordKey => LETTER_WORDS[card.letter]

const SUKUN = 'ْ'

/**
 * `text` (a Quran word from the fetched data) split around `letter`: the first grapheme that
 * writes it with a sukun, else the first that writes it at all; `undefined` when none does.
 */
export function splitAtLetter(text: string, letter: ArabicLetter): { before: string; at: string; after: string; sakin: boolean } | undefined {
  const graphemes = splitGraphemes(text)
  const writing = graphemes.filter((g) => writesLetter(g.segment, letter))
  const found = writing.find((g) => g.segment.includes(SUKUN)) ?? writing[0]
  if (!found) return undefined
  const end = found.index + found.segment.length
  return { before: text.slice(0, found.index), at: found.segment, after: text.slice(end), sakin: found.segment.includes(SUKUN) }
}
