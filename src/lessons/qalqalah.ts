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
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 24,
        note: {
          ar: 'يذكر هذا البيت حروف القلقلة الخمسة مجموعة في «قُطْبُ جَدٍّ»، ضمن أبيات صفات الحروف.',
          en: 'Among the lines on the letters’ characteristics, this one names the five qalqalah letters, gathered in "qutbu jadd" (ق ط ب ج د).',
        },
      },
      {
        from: 39,
        note: {
          ar: 'أوضح القلقلة إذا كان الحرف ساكنًا، وهي أبين إذا وقفتَ عليه — وهو الفرق بين القلقلة الصغرى والكبرى.',
          en: 'Make the qalqalah clear when the letter is sakin, and it is even clearer when you stop on it — the difference between minor and major qalqalah.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحروف التي فيها قلقلة في هذه الآية.',
        en: 'Tap the letters in this ayah that have qalqalah.',
      },
      verseKey: '112:3',
      rule: 'qalaqah',
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم عدد حروف القلقلة؟', en: 'How many qalqalah letters are there?' },
      options: [
        { ar: '٣', en: '3' },
        { ar: '٥', en: '5' },
        { ar: '٧', en: '7' },
        { ar: '١٠', en: '10' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'حروف القلقلة خمسة، يجمعها قولك: «قُطْبُ جَدٍّ».',
        en: 'There are five: ق ط ب ج د, gathered in the phrase "قُطْبُ جَدٍّ" (qutbu jadd).',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي مجموعة من الحروف التالية هي حروف القلقلة؟',
        en: 'Which of these groups are the qalqalah letters?',
      },
      options: [
        { ar: 'ق ط ب ج د', en: 'ق ط ب ج د' },
        { ar: 'ب ج د ذ ز', en: 'ب ج د ذ ز' },
        { ar: 'ء ه ع ح غ خ', en: 'ء ه ع ح غ خ' },
        { ar: 'م ن و ي', en: 'م ن و ي' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'حروف القلقلة خمسة فقط: ق ط ب ج د.',
        en: 'The qalqalah letters are exactly these five: ق ط ب ج د.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'متى تكون القلقلة كبرى؟', en: 'When is qalqalah major (kubra)?' },
      options: [
        {
          ar: 'عندما يكون الحرف ساكنًا في وسط الكلمة',
          en: 'When the letter has a sukun in the middle of a word',
        },
        {
          ar: 'عندما نقف على حرف القلقلة في آخر الكلمة',
          en: 'When we stop on a qalqalah letter at the end of a word',
        },
        { ar: 'عندما يكون الحرف متحركًا', en: 'When the letter carries a vowel' },
        { ar: 'عندما يكون الحرف في أول الكلمة', en: 'When the letter is at the start of a word' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'القلقلة الكبرى تكون عند الوقف على حرف القلقلة في آخر الكلمة، فتكون النبرة أوضح من القلقلة الصغرى.',
        en: 'Major qalqalah happens when we stop on a qalqalah letter at the end of a word — the echo is clearer than the minor (sughra) kind.',
      },
    },
  ],
  reviewed: false,
}
