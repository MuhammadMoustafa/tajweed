import { PRACTICE_SECTIONS } from './practice-fatiha'
import type { Lesson } from './types'

export const practiceNas: Lesson = {
  id: 'practice-nas',
  order: 9.2,
  unit: 'practice',
  title: { ar: 'تطبيق: سورة الناس', en: 'Practice: an-Nas' },
  summary: {
    ar: 'غنّة ومدّ عارض في آخر كل آية.',
    en: 'A ghunnah and a madd ʿarid at the end of every ayah.',
  },
  sections: [
    {
      body: {
        ar: 'تنتهي آيات سورة الناس كلها بصوت واحد: نون مشدّدة تُغنّ بمقدار حركتين، ثم مدّ عارض للسكون عند الوقف. اجعل الغنّة بطول واحد، والمدّ بطول واحد، في كل الآيات.',
        en: 'Every ayah of an-Nas ends with the same sound: a doubled noon held with a ghunnah for two counts, then a madd ʿarid lis-sukun when you stop. Give the ghunnah one length and the madd one length in every ayah.',
      },
    },
    ...PRACTICE_SECTIONS,
  ],
  // Every rule the API tags in these six ayat (practice.test.ts checks it against quran.json).
  focusRules: ['madda_permissible', 'madda_normal', 'ghunnah', 'ikhafa', 'ham_wasl', 'laam_shamsiyah'],
  examples: [
    {
      verseKey: '114:1',
      note: {
        ar: 'في الكلمة الأخيرة: همزة وصل، ولام شمسية، ونون مشدّدة بغنّة، ومدّ عارض عند الوقف.',
        en: 'In the last word: a connecting hamza, a sun lam, a doubled noon with ghunnah, and a madd ʿarid when you stop.',
      },
    },
    {
      verseKey: '114:2',
      note: {
        ar: 'الأحكام نفسها في الكلمة الأخيرة؛ سمِّ كل لون قبل أن تنظر إلى المفتاح.',
        en: 'The same rules in the last word: name each color before you look at the key.',
      },
    },
    {
      verseKey: '114:3',
      note: {
        ar: 'مدّ طبيعي في الكلمة الأولى، ثم أحكام الكلمة الأخيرة نفسها.',
        en: 'A natural madd in the first word, then the same rules in the last word.',
      },
    },
    {
      verseKey: '114:4',
      note: {
        ar: 'إخفاء النون قبل الشين، وهمزتا وصل، ونون مشدّدة بغنّة، ومدّ عارض عند الوقف. واللام في الكلمتين الأخيرتين قمرية تُنطق، فلا تُلوَّن.',
        en: 'Ikhfa of the noon before sheen, two connecting hamzas, a doubled noon with ghunnah, and a madd ʿarid when you stop. The lam in the last two words is a moon lam: it is pronounced, so it stays uncolored.',
      },
    },
    {
      verseKey: '114:5',
      note: {
        ar: 'لا يُلوَّن إلا الكلمة الأخيرة: همزة وصل، ولام شمسية، ونون مشدّدة بغنّة، ومدّ عارض.',
        en: 'Only the last word is colored: a connecting hamza, a sun lam, a doubled noon with ghunnah, and a madd ʿarid.',
      },
    },
    {
      verseKey: '114:6',
      note: {
        ar: 'همزة وصل ونون مشدّدة بغنّة في الكلمة الثانية، ولامها قمرية تُنطق، ثم أحكام الكلمة الأخيرة نفسها.',
        en: 'A connecting hamza and a doubled noon with ghunnah in the second word, whose lam is a moon lam and is pronounced; then the same rules in the last word.',
      },
    },
  ],
  reviewed: false,
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي فيه غنّة في هذه الآية.',
        en: 'Tap the letter in this ayah that has a ghunnah.',
      },
      verseKey: '114:1',
      rule: 'ghunnah',
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'كم حركة تُغنّ النون المشدّدة؟',
        en: 'For how many counts is a doubled noon held with ghunnah?',
      },
      options: [
        { ar: 'حركة واحدة', en: '1' },
        { ar: 'حركتان', en: '2' },
        { ar: 'أربع حركات', en: '4' },
        { ar: 'ست حركات', en: '6' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الغنّة في النون والميم المشدّدتين بمقدار حركتين.',
        en: 'The ghunnah on a doubled noon or meem lasts two counts.',
      },
    },
  ],
}
