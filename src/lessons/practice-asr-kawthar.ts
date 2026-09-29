import { PRACTICE_SECTIONS } from './practice-fatiha'
import type { Lesson } from './types'

export const practiceAsrKawthar: Lesson = {
  id: 'practice-asr-kawthar',
  order: 9.3,
  unit: 'practice',
  title: { ar: 'تطبيق: سورتا العصر والكوثر', en: 'Practice: al-ʿAsr and al-Kawthar' },
  summary: {
    ar: 'سورتان من ثلاث آيات، فيهما ألف لا تُنطق وقلقلة صغرى.',
    en: 'Two surahs of three ayat each, with silent alifs and a minor qalqalah.',
  },
  sections: [
    {
      body: {
        ar: 'سورتان قصيرتان من ثلاث آيات. لاحظ الألف التي تُكتب بعد واو الجماعة ولا تُنطق، والباء الساكنة في وسط الكلمة وقلقلتها صغرى.',
        en: 'Two short surahs of three ayat each. Notice the alif written after the plural waw that is not pronounced, and the ba with a sukun inside a word, whose qalqalah is minor.',
      },
    },
    ...PRACTICE_SECTIONS,
  ],
  // Every rule the API tags in these six ayat (practice.test.ts checks it against quran.json).
  focusRules: ['madda_obligatory', 'madda_normal', 'ghunnah', 'ikhafa', 'qalaqah', 'ham_wasl', 'laam_shamsiyah', 'slnt'],
  examples: [
    {
      verseKey: '103:1',
      note: {
        ar: 'لا يُلوَّن إلا همزة الوصل، واللام بعدها قمرية تُنطق.',
        en: 'Only the connecting hamza is colored; the lam after it is a moon lam, so it is pronounced.',
      },
    },
    {
      verseKey: '103:2',
      note: {
        ar: 'غنّة على النون المشدّدة في أولها، ثم كلمة فيها همزة وصل وإخفاء النون الساكنة قبل السين ومدّ طبيعي.',
        en: 'A ghunnah on the doubled noon at the start, then one word with a connecting hamza, ikhfa of the noon sakinah before seen, and a natural madd.',
      },
    },
    {
      verseKey: '103:3',
      note: {
        ar: 'ألف بعد واو الجماعة لا تُنطق في أربعة مواضع، وهمزات وصل، ولامان شمسيتان، ومدّان طبيعيان، وقلقلة صغرى على الباء الساكنة في وسط الكلمة الأخيرة.',
        en: 'An alif after the plural waw that is not pronounced, four times; connecting hamzas; two sun lams; two natural madds; and a minor qalqalah on the ba with a sukun in the middle of the last word.',
      },
    },
    {
      verseKey: '108:1',
      note: {
        ar: 'غنّة على النون المشدّدة، ومدّ منفصل (حرف مدّ في آخر كلمة وهمزة في أول التي بعدها)، ومدّ طبيعي، وهمزة وصل في الكلمة الأخيرة.',
        en: 'A ghunnah on the doubled noon; a separated madd (a madd letter ends one word and a hamza starts the next); a natural madd; and a connecting hamza in the last word.',
      },
    },
    {
      verseKey: '108:2',
      note: {
        ar: 'لا يُلوَّن إلا همزة الوصل. والنون الساكنة قبل الحاء تُظهَر (إظهار)، والإظهار لا يُلوَّن.',
        en: 'Only the connecting hamza is colored. The noon sakinah before ḥa is read clearly (izhar), which is not colored.',
      },
    },
    {
      verseKey: '108:3',
      note: {
        ar: 'غنّة على النون المشدّدة، وهمزة وصل، وقلقلة صغرى على الباء الساكنة في وسط الكلمة الأخيرة.',
        en: 'A ghunnah on the doubled noon, a connecting hamza, and a minor qalqalah on the ba with a sukun in the middle of the last word.',
      },
    },
  ],
  reviewed: false,
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على كل حرف يُكتب ولا يُنطق في هذه الآية.',
        en: 'Tap every letter in this ayah that is written but not pronounced.',
      },
      verseKey: '103:3',
      rule: 'slnt',
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما نوع القلقلة على الباء الساكنة في وسط الكلمة الأخيرة من سورة الكوثر؟',
        en: 'What kind of qalqalah is on the ba with a sukun in the middle of the last word of al-Kawthar?',
      },
      options: [
        { ar: 'صغرى', en: 'Minor (sughra)' },
        { ar: 'كبرى', en: 'Major (kubra)' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الباء ساكنة في وسط الكلمة، والوقف يكون على الحرف الذي بعدها، فقلقلتها صغرى.',
        en: 'The ba has its sukun in the middle of the word, and the stop falls on the letter after it, so its qalqalah is minor.',
      },
    },
  ],
}
