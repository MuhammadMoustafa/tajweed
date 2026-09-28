import type { Lesson } from './types'

export const qalqalah: Lesson = {
  id: 'qalqalah',
  order: 10,
  title: { ar: 'القلقلة', en: 'Qalqalah (the echo)' },
  summary: {
    ar: 'نبرة قوية ترتدّ مع خمسة حروف إذا كانت ساكنة.',
    en: 'A small bouncing echo on five letters when they carry a sukun.',
  },
  sections: [
    {
      body: {
        ar: 'القلقلة هي اضطراب الصوت عند النطق بالحرف الساكن حتى يُسمع له نبرة قوية، كأن الصوت يرتدّ.',
        en: 'Qalqalah is a slight vibration of the sound when a letter has a sukun, so it is heard with a strong little bounce, as if the sound echoes.',
      },
    },
    {
      heading: { ar: 'حروفها', en: 'Its letters' },
      body: {
        ar: 'حروف القلقلة خمسة، يجمعها قولك: «قُطْبُ جَدٍّ» — ق ط ب ج د.',
        en: 'There are five qalqalah letters — ق ط ب ج د — gathered in the phrase "قُطْبُ جَدٍّ" (qutbu jadd).',
      },
    },
    {
      heading: { ar: 'مراتبها', en: 'Its levels' },
      body: {
        ar: 'صغرى: إذا كان الحرف ساكنًا في وسط الكلمة أو في آخرها عند الوصل. كبرى: إذا وقفنا على الحرف في آخر الكلمة، وتكون النبرة فيها أوضح.',
        en: 'Minor (sughra): the letter has a sukun in the middle of a word, or at its end while continuing. Major (kubra): we stop on the letter at the end of a word, and the echo is clearer.',
      },
    },
  ],
  animation: 'qalqalah-bounce',
  focusRules: ['qalaqah'],
  examples: [
    {
      verseKey: '112:1',
      note: {
        ar: 'عند الوقف على آخر الآية تكون القلقلة كبرى.',
        en: 'Stopping at the end of the ayah makes it a major qalqalah.',
      },
    },
    {
      verseKey: '112:3',
      note: {
        ar: 'لاحظ الحرف الملوَّن في وسط الآية وفي آخرها.',
        en: 'Notice the colored letter in the middle of the ayah and at its end.',
      },
    },
    {
      verseKey: '113:1',
      note: {
        ar: 'قلقلة كبرى عند الوقف على آخر الآية.',
        en: 'A major qalqalah when stopping at the end of the ayah.',
      },
    },
  ],
  reviewed: false,
}
