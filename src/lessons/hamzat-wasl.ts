import type { Lesson } from './types'

export const hamzatWasl: Lesson = {
  id: 'hamzat-wasl',
  order: 8.1,
  unit: 'stopping',
  title: { ar: 'همزة الوصل والحروف التي لا تُنطق', en: 'Hamzat al-wasl and silent letters' },
  summary: {
    ar: 'همزة تُنطق إذا ابتدأنا بها وتسقط إذا وصلناها، وحروف تُكتب في المصحف ولا تُقرأ.',
    en: 'A hamza that is read when we start with it and dropped when we join it, and letters that are written in the mushaf but not read.',
  },
  sections: [
    {
      body: {
        ar: 'همزة الوصل همزة في أول بعض الكلمات تُكتب في المصحف ألفًا صغيرة عليها رأس صاد (ٱ). إذا ابتدأنا القراءة بالكلمة نطقناها، وإذا وصلنا الكلمة بما قبلها سقطت ولم تُنطق. أما همزة القطع فتُنطق دائمًا.',
        en: 'Hamzat al-wasl (the "connecting" hamza) is a hamza at the start of some words, written in the mushaf as an alif with a small head above it (ٱ). If we start the recitation with that word, it is read; if we join the word to what comes before it, it drops and is not read. A qat’ hamza, by contrast, is always read.',
      },
    },
    {
      heading: { ar: 'بأي حركة نبتدئ بها؟', en: 'Which vowel do we start it with?' },
      body: {
        ar: 'في «أل» التعريف نبتدئ بالفتح. وفي الفعل ننظر إلى الحرف الثالث فيه (والهمزة أول حرف): إن كان مضمومًا ضممنا عند الابتداء، وإن كان مفتوحًا أو مكسورًا كسرنا. وفي الأسماء المعدودة في بيت الجزرية نبتدئ بالكسر.',
        en: 'In the article al- we start with a fatha. In a verb we look at its third letter (the hamza is the first): if that letter has a damma we start with a damma, and if it has a fatha or a kasra we start with a kasra. In the few nouns the Jazariyyah lists (see the lines below) we start with a kasra.',
      },
      animation: 'hamzat-wasl-vowel',
    },
    {
      heading: { ar: 'الحروف التي تُكتب ولا تُنطق', en: 'Letters that are written but not read' },
      body: {
        ar: 'في المصحف حروف تُكتب ولا تُقرأ. من أشهرها الألف التي بعد واو الجماعة في آخر الفعل، وعليها دائرة صغيرة (۟) علامة على أنها لا تُقرأ: ينتهي الصوت عند الواو، وصلًا ووقفًا. وكذلك همزة الوصل إذا وُصلت، ولام «أل» في الحروف الشمسية (وله درس مستقل).',
        en: 'Some letters are written in the mushaf but not read. A well-known one is the alif after the waw of the plural at the end of a verb; it carries a small circle (۟), the sign that it is not read: the sound ends on the waw, whether we continue or stop. Two others you already know are a wasl hamza that is joined, and the lam of al- before a sun letter (which has its own lesson).',
      },
      animation: 'silent-letters',
    },
  ],
  animation: 'hamzat-wasl',
  focusRules: ['ham_wasl', 'slnt'],
  examples: [
    {
      verseKey: '96:1',
      note: {
        ar: 'الكلمة الأولى تبدأ الآية، فتُنطق همزة الوصل فيها بالكسر لأن حرفها الثالث مفتوح. أما همزة الوصل في الكلمة الرابعة فتسقط لأنها موصولة بما قبلها.',
        en: 'The first word begins the ayah, so its wasl hamza is read, with a kasra because its third letter has a fatha. The wasl hamza in the fourth word drops, because it is joined to the word before.',
      },
    },
    {
      verseKey: '1:1',
      note: {
        ar: 'في الكلمات الثانية والثالثة والرابعة همزة وصل ملوّنة: تسقط كلها هنا لاتصالها بما قبلها. ولو ابتدأنا بإحداها لنطقناها بالفتح لأنها «أل».',
        en: 'The second, third and fourth words each have a colored wasl hamza; all of them drop here because they are joined to what comes before. If we started with one, we would read it with a fatha, since it is the article al-.',
      },
    },
    {
      verseKey: '2:208',
      note: {
        ar: 'الكلمة الرابعة فعل حرفه الثالث مضموم، فنبتدئ بهمزتها بالضم. والألف الملوّنة في آخر الكلمات الثالثة والرابعة والتاسعة ألف بعد واو الجماعة: لا تُقرأ.',
        en: 'The fourth word is a verb whose third letter has a damma, so we would start it with a damma. The colored alif at the end of the third, fourth and ninth words follows the waw of the plural: it is not read.',
      },
    },
    {
      verseKey: '72:20',
      note: {
        ar: 'الكلمة الثالثة تنتهي بواو وبعدها ألف مكتوبة لا تُقرأ.',
        en: 'The third word ends with a waw followed by a written alif that is not read.',
      },
    },
    {
      verseKey: '83:30',
      note: {
        ar: 'الكلمة الثانية تنتهي بواو وبعدها ألف مكتوبة لا تُقرأ.',
        en: 'The second word ends with a waw followed by a written alif that is not read.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 101,
        to: 103,
        note: {
          ar: 'باب همز الوصل في الجزرية: الابتداء بالضم إن كان الحرف الثالث من الفعل مضمومًا، والكسر في غير ذلك، وفتح همزة «أل»، وكسرها في الأسماء المعدودة في البيت الأخير.',
          en: 'The Jazariyyah’s chapter on hamzat al-wasl: start with a damma when the third letter of a verb has a damma, otherwise a kasra; a fatha for the article al-; and a kasra in the nouns listed in the last line.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي لا يُقرأ في هذه الآية (ألف بعد واو الجماعة).',
        en: 'Tap the letter in this ayah that is written but not read (the alif after the waw of the plural).',
      },
      verseKey: '83:30',
      rule: 'slnt',
    },
    {
      kind: 'choice',
      prompt: { ar: 'متى تسقط همزة الوصل؟', en: 'When does the wasl hamza drop?' },
      options: [
        { ar: 'إذا ابتدأنا بالكلمة', en: 'When we start with the word' },
        { ar: 'إذا وصلنا الكلمة بما قبلها', en: 'When we join the word to what comes before it' },
        { ar: 'دائمًا', en: 'Always' },
        { ar: 'في آخر الآية فقط', en: 'Only at the end of an ayah' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'تُنطق همزة الوصل عند الابتداء بها وتسقط عند الوصل.',
        en: 'The wasl hamza is read when we start with it and dropped when we join it.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'بأي حركة نبتدئ همزة الوصل في «أل» التعريف؟',
        en: 'With which vowel do we start the wasl hamza of the article al-?',
      },
      options: [
        { ar: 'فتحة', en: 'Fatha' },
        { ar: 'ضمة', en: 'Damma' },
        { ar: 'كسرة', en: 'Kasra' },
        { ar: 'لا نبتدئ بها', en: 'We never start with it' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'نبتدئ همزة «أل» بالفتح.',
        en: 'The hamza of al- is started with a fatha.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'فعل بدايته همزة وصل وحرفه الثالث مضموم: بأي حركة نبتدئ؟',
        en: 'A verb begins with a wasl hamza and its third letter has a damma: which vowel do we start with?',
      },
      options: [
        { ar: 'فتحة', en: 'Fatha' },
        { ar: 'ضمة', en: 'Damma' },
        { ar: 'كسرة', en: 'Kasra' },
        { ar: 'سكون', en: 'Sukun' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'إذا كان الحرف الثالث من الفعل مضمومًا نبتدئ بالضم، وإلا فبالكسر.',
        en: 'When the third letter of the verb has a damma we start with a damma; otherwise with a kasra.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ماذا نفعل بالألف المكتوبة بعد واو الجماعة في آخر الفعل؟',
        en: 'What do we do with the alif written after the waw of the plural at the end of a verb?',
      },
      options: [
        { ar: 'نمدّها ست حركات', en: 'Stretch it six counts' },
        { ar: 'لا نقرؤها', en: 'We do not read it' },
        { ar: 'نقرؤها همزة', en: 'Read it as a hamza' },
        { ar: 'نقرؤها إذا وقفنا فقط', en: 'Read it only when stopping' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'هذه الألف تُكتب ولا تُقرأ، وصلًا ووقفًا.',
        en: 'That alif is written but not read, whether continuing or stopping.',
      },
    },
  ],
  reviewed: false,
}
