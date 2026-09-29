import type { Lesson } from './types'

/**
 * Waqf and ibtida (L19). The stop signs are not tagged by the API, so each example places a
 * `waqf_sign` mark on the letter that carries the sign (the sign is a mark attached to that
 * letter in the verse text). Positions were found in src/data/quran.json by word/letter index.
 */
export const waqf: Lesson = {
  id: 'waqf',
  order: 19,
  title: { ar: 'الوقف والابتداء', en: 'Waqf and ibtida (stopping and restarting)' },
  summary: {
    ar: 'علامات الوقف في المصحف، وكيف نقف على الكلمة، ومن أين نبدأ بعد الوقف.',
    en: 'The stop signs of the mushaf, how to stop on a word, and where to restart.',
  },
  sections: [
    {
      body: {
        ar: 'الوقف: قطع الصوت عن آخر الكلمة زمنًا يُتنفَّس فيه عادةً، بنيّة استئناف القراءة. والابتداء: الشروع في القراءة بعد الوقف. ويجب أن يكون الوقف والابتداء في موضع يصحّ فيه المعنى.',
        en: 'Waqf is cutting the sound off at the end of a word for a moment, normally to take a breath, intending to carry on reading. Ibtida is starting to read again afterwards. Both should fall where the meaning stays sound.',
      },
    },
    {
      heading: { ar: 'علامات الوقف', en: 'The stop signs' },
      body: {
        ar: 'في مصحف المدينة علامات صغيرة فوق الكلام: الميم للوقف اللازم، و«لا» للنهي عن الوقف، و«صلى» أي الوصل أولى، و«قلى» أي الوقف أولى، والجيم لجواز الأمرين. وثلاث نقاط تأتي مرتين معًا تسمى المعانقة: تقف عند إحداهما لا عندهما معًا. ونهاية الآية موضع وقف مستحب.',
        en: 'The Madani mushaf puts small signs above the text: meem for a required stop; lam-alif for do not stop; the sad-lam sign for "continuing is better"; the qaf-lam sign for "stopping is better"; and jeem for "either is fine". Three dots that come twice together are the muʿanaqah pair: stop at one of them, never at both. The end of an ayah is a recommended place to stop.',
      },
      animation: 'waqf-signs',
    },
    {
      heading: { ar: 'كيف نقف على الكلمة', en: 'How to stop on a word' },
      body: {
        ar: 'الأصل في الوقف السكون على الحرف الأخير. فإذا كان عليه تنوين ضم أو كسر سقط التنوين. وتنوين الفتح يصير ألفًا. والتاء المربوطة تُقرأ هاءً ساكنة.',
        en: 'The basic way to stop is a sukun on the last letter. If it has tanween damma or kasra, the tanween drops. Tanween fatha turns into an alif. A ta marbuta is read as a sakin ha.',
      },
      animation: 'waqf-stop',
    },
    {
      heading: { ar: 'أين نبدأ', en: 'Where to restart' },
      body: {
        ar: 'إن وقفنا حيث يتمّ المعنى بدأنا من الكلمة التي بعدها. وإن اضطررنا للوقف قبل تمام المعنى، بحثنا عن كلمة قبل موضع الوقف يصحّ الابتداء منها، ثم وصلنا القراءة.',
        en: 'If we stopped where the meaning was complete, we begin at the next word. If we were forced to stop before the meaning was complete, we go back to a word before that spot where starting makes sense, and read on from there.',
      },
      animation: 'waqf-restart',
    },
  ],
  animation: 'waqf-signs',
  focusRules: ['waqf_sign'],
  examples: [
    {
      verseKey: '54:6',
      note: {
        ar: 'الحرف الملوَّن عليه علامة الميم: وقف لازم.',
        en: 'The colored letter carries the meem sign: a required stop.',
      },
      marks: [{ word: 2, letter: 4, rule: 'waqf_sign' }],
    },
    {
      verseKey: '16:24',
      note: {
        ar: 'الحرف الملوَّن عليه علامة «لا»: لا نقف هنا.',
        en: 'The colored letter carries the lam-alif sign: do not stop here.',
      },
      marks: [{ word: 6, letter: 4, rule: 'waqf_sign' }],
    },
    {
      verseKey: '89:17',
      note: {
        ar: 'علامة «صلى» على الحرف الملوَّن في أول الآية: الوصل أولى.',
        en: 'The sad-lam sign on the colored letter, in the first word: continuing is better.',
      },
      marks: [{ word: 1, letter: 3, rule: 'waqf_sign' }],
    },
    {
      verseKey: '16:17',
      note: {
        ar: 'علامة «قلى» على الحرف الملوَّن في الكلمة الخامسة: الوقف أولى.',
        en: 'The qaf-lam sign on the colored letter, in the fifth word: stopping is better.',
      },
      marks: [{ word: 5, letter: 4, rule: 'waqf_sign' }],
    },
    {
      verseKey: '110:3',
      note: {
        ar: 'علامة الجيم على الحرف الملوَّن في الكلمة الرابعة: الوقف والوصل سواء.',
        en: 'The jeem sign on the colored letter, in the fourth word: stopping and continuing are equal.',
      },
      marks: [{ word: 4, letter: 8, rule: 'waqf_sign' }],
    },
    {
      verseKey: '2:2',
      note: {
        ar: 'المعانقة: ثلاث نقاط عند الحرفين الملوَّنين. نقف عند أحدهما لا عندهما معًا.',
        en: 'The muʿanaqah pair: three dots at each of the two colored letters. We stop at one of them, not both.',
      },
      marks: [
        { word: 4, letter: 3, rule: 'waqf_sign' },
        { word: 5, letter: 3, rule: 'waqf_sign' },
      ],
    },
    {
      verseKey: '112:1',
      note: {
        ar: 'الحرف الملوَّن في آخر الآية عليه تنوين ضم: عند الوقف يسقط التنوين ويسكن الحرف.',
        en: 'The colored letter at the end of the ayah has tanween damma: stopping drops it and leaves a sukun.',
      },
      marks: [{ word: 4, letter: 3, rule: 'waqf_sign' }],
    },
    {
      verseKey: '78:6',
      note: {
        ar: 'آخر الآية تنوين فتح: عند الوقف يُقرأ ألفًا، والألف هي الحرف الملوَّن.',
        en: 'The end of the ayah has tanween fatha: stopping reads it as an alif, the colored letter.',
      },
      marks: [{ word: 4, letter: 5, rule: 'waqf_sign' }],
    },
    {
      verseKey: '101:1',
      note: {
        ar: 'الحرف الملوَّن تاء مربوطة: عند الوقف تُقرأ هاءً ساكنة.',
        en: 'The colored letter is a ta marbuta: stopping reads it as a sakin ha.',
      },
      marks: [{ word: 1, letter: 7, rule: 'waqf_sign' }],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 73,
        to: 78,
        note: {
          ar: 'يبيّن ابن الجزري أنه لا بدّ بعد إتقان الحروف من معرفة الوقوف والابتداء، ويقسّمها إلى تام وكافٍ وحسن وقبيح، ويبيّن أين يحسن الابتداء، ويختم بأنه ليس في القرآن وقف يجب ولا حرام إلا لسبب.',
          en: 'Ibn al-Jazari says that after mastering the letters one must know where to stop and restart. He divides stops into complete, sufficient, good and bad, says where restarting is sound, and ends that no stop in the Quran is obligatory or forbidden in itself, only for a reason.',
        },
      },
      {
        from: 101,
        to: 103,
        note: {
          ar: 'في الابتداء بهمزة الوصل: كيف تُحرَّك حين نبدأ بها، ومتى تُضمّ ومتى تُكسر.',
          en: 'On restarting with a hamzat al-wasl: how it is vowelled when we start on it, and when it takes damma or kasra.',
        },
      },
      {
        from: 104,
        to: 105,
        note: {
          ar: 'في الوقف على أواخر الكلم: يُحذَّر من الوقف بالحركة الكاملة، ويُرخَّص في الرَّوم والإشمام لمن أراد. وهذا فوق مستوى المبتدئ، فالأصل السكون.',
          en: 'On stopping at the ends of words: beware of stopping with the full vowel; roum and ishmam are permitted for whoever wants them. That is beyond the beginner level, so the basic way is sukun.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرفين اللذين عليهما علامة المعانقة.',
        en: 'Tap the two letters that carry the muʿanaqah dots.',
      },
      verseKey: '2:2',
      rule: 'waqf_sign',
      marks: [
        { word: 4, letter: 3, rule: 'waqf_sign' },
        { word: 5, letter: 3, rule: 'waqf_sign' },
      ],
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا تعني علامة الميم الصغيرة؟', en: 'What does the small meem sign mean?' },
      options: [
        { ar: 'وقف لازم', en: 'A required stop' },
        { ar: 'لا تقف', en: 'Do not stop' },
        { ar: 'الوصل أولى', en: 'Continuing is better' },
        { ar: 'الوقف والوصل سواء', en: 'Either is fine' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الميم علامة الوقف اللازم.',
        en: 'Meem is the sign of a required stop.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا نفعل عند علامة «لا»؟', en: 'What do we do at the lam-alif sign?' },
      options: [
        { ar: 'نقف وجوبًا', en: 'We must stop' },
        { ar: 'لا نقف بل نصل', en: 'We do not stop; we read on' },
        { ar: 'نقف إن شئنا أو نصل', en: 'We may stop or read on' },
        { ar: 'نعيد الآية', en: 'We repeat the ayah' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'علامة «لا» تنهى عن الوقف عندها.',
        en: 'The lam-alif sign tells us not to stop there.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'إذا وقفنا على كلمة آخرها تنوين فتح فماذا نقرأ؟',
        en: 'If we stop on a word ending in tanween fatha, what do we read?',
      },
      options: [
        { ar: 'نونًا ساكنة', en: 'A sakin noon' },
        { ar: 'ألفًا', en: 'An alif' },
        { ar: 'هاءً ساكنة', en: 'A sakin ha' },
        { ar: 'الحركة كاملة', en: 'The full vowel' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'تنوين الفتح يصير ألفًا عند الوقف.',
        en: 'Tanween fatha turns into an alif when we stop.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'كيف تُقرأ التاء المربوطة عند الوقف؟',
        en: 'How is a ta marbuta read when we stop?',
      },
      options: [
        { ar: 'تاءً ساكنة', en: 'A sakin ta' },
        { ar: 'هاءً ساكنة', en: 'A sakin ha' },
        { ar: 'ألفًا', en: 'An alif' },
        { ar: 'لا تُقرأ', en: 'It is not read' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'التاء المربوطة تُقرأ هاءً ساكنة عند الوقف.',
        en: 'A ta marbuta is read as a sakin ha when we stop.',
      },
    },
  ],
  reviewed: false,
}
