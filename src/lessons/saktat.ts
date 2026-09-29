import type { Lesson } from './types'

/** Hafs ʿan ʿAsim by the route of ash-Shatibiyyah: the four required saktat (L23). */
export const saktat: Lesson = {
  id: 'saktat',
  order: 11,
  unit: 'hafs-special',
  title: { ar: 'السكتات الأربع', en: 'The four saktat (short pauses)' },
  summary: {
    ar: 'أربعة مواضع يسكت فيها حفص سكتة لطيفة بلا تنفّس.',
    en: 'Four places where Hafs makes a short pause without taking a breath.',
  },
  sections: [
    {
      body: {
        ar: 'السكت: قطع الصوت زمنًا يسيرًا — نحو حركتين — دون أخذ نفَس، بنيّة مواصلة القراءة. وهو أقصر من الوقف، فالوقف يكون معه تنفّس.',
        en: 'Sakt means cutting the sound off for a short moment — about two counts — without taking a breath, meaning to carry on reading. It is shorter than a stop (waqf), where you do breathe.',
      },
      animation: 'hafs-sakt',
    },
    {
      heading: { ar: 'مواضعه عند حفص', en: 'Where Hafs pauses' },
      body: {
        ar: 'يسكت حفص من طريق الشاطبية وجوبًا عند الوصل في أربعة مواضع، وعلامتها في المصحف سين صغيرة فوق آخر الكلمة: آخر الآية الأولى من الكهف إذا وصلتها بالثانية، وفي يس (٥٢)، وفي القيامة (٢٧)، وفي المطففين (١٤).',
        en: 'By the route of ash-Shatibiyyah, Hafs must pause in four places when reading on, marked in the mushaf by a small seen over the end of the word: the end of the first ayah of al-Kahf when joined to the second, and in Ya-Sin (52), al-Qiyamah (27) and al-Mutaffifin (14).',
      },
    },
    {
      heading: { ar: 'ما يمنعه السكت', en: 'What the pause prevents' },
      body: {
        ar: 'في القيامة والمطففين يمنع السكتُ الإدغام: تُنطق النون الساكنة ثم اللام الساكنة واضحتين قبل الراء، ولا تُدغمان فيها. وإذا وقفتَ عند الموضع (بتنفّس) فهو وقف عادي لا سكت.',
        en: 'In al-Qiyamah and al-Mutaffifin the pause stops a merge: the sakin noon, and the sakin lam, are said clearly before the ra instead of merging into it. If you stop there (with a breath), it is an ordinary stop, not a sakt.',
      },
    },
  ],
  animation: 'hafs-sakt',
  focusRules: ['hafs_special'],
  examples: [
    {
      verseKey: '18:1',
      note: {
        ar: 'آخر الآية عند وصلها بالثانية: تُقرأ الألف الملوّنة ألفًا بلا تنوين كما في الوقف، ثم سكتة بلا نفَس، ثم أول الآية الثانية.',
        en: 'The end of the ayah, when joined to the next: read the colored alif as a plain alif with no tanween, as when stopping, then pause without breath, then start the next ayah.',
      },
      marks: [{ word: 11, letter: 4, rule: 'hafs_special' }],
    },
    {
      verseKey: '36:52',
      note: {
        ar: 'سكتة على الألف الملوّنة في آخر الكلمة السادسة، ثم تُكمل. وفوقها أيضًا علامة وقف، فإن وقفتَ فهو وقف لا سكت.',
        en: 'Pause on the colored alif at the end of the sixth word, then carry on. It also has a stop sign: if you stop there, it is a stop, not a sakt.',
      },
      marks: [{ word: 6, letter: 6, rule: 'hafs_special' }],
    },
    {
      verseKey: '75:27',
      note: {
        ar: 'النون الملوّنة تُنطق واضحة ثم سكتة، فلا تُدغم في الراء بعدها.',
        en: 'Say the colored noon clearly, then pause, so it does not merge into the ra after it.',
      },
      // The API tags this noon (with the ra) as idgham without ghunnah; Hafs's sakt keeps it clear.
      marks: [{ word: 2, letter: 2, rule: 'hafs_special', override: true }],
    },
    {
      verseKey: '83:14',
      note: {
        ar: 'اللام الملوّنة تُنطق واضحة ثم سكتة، فلا تُدغم في الراء بعدها.',
        en: 'Say the colored lam clearly, then pause, so it does not merge into the ra after it.',
      },
      marks: [{ word: 2, letter: 2, rule: 'hafs_special' }],
    },
  ],
  mutoon: { tuhfa: 'not-covered', jazariyya: 'not-covered' },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ما السكت؟', en: 'What is a sakt?' },
      options: [
        { ar: 'قطع الصوت زمنًا يسيرًا بلا تنفّس', en: 'Cutting the sound for a moment, without a breath' },
        { ar: 'قطع الصوت مع التنفّس', en: 'Cutting the sound and taking a breath' },
        { ar: 'مدّ الحرف ست حركات', en: 'Stretching a letter for six counts' },
        { ar: 'إدغام الحرف في الذي بعده', en: 'Merging a letter into the next one' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'السكت قطع يسير للصوت نحو حركتين بلا نفَس؛ أما الوقف فمعه تنفّس.',
        en: 'A sakt is a short break of about two counts with no breath; a stop (waqf) comes with a breath.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم موضعًا يجب فيه السكت لحفص من طريق الشاطبية؟', en: 'In how many places must Hafs pause (sakt) by the Shatibiyyah route?' },
      options: [
        { ar: '٢', en: '2' },
        { ar: '٤', en: '4' },
        { ar: '٦', en: '6' },
        { ar: '١٠', en: '10' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'أربعة: الكهف (١–٢)، يس (٥٢)، القيامة (٢٧)، المطففين (١٤).',
        en: 'Four: al-Kahf (1–2), Ya-Sin (52), al-Qiyamah (27), al-Mutaffifin (14).',
      },
    },
    {
      kind: 'tap',
      prompt: { ar: 'اضغط على الحرف الذي يُسكت عليه.', en: 'Tap the letter the reciter pauses on.' },
      verseKey: '83:14',
      rule: 'hafs_special',
      marks: [{ word: 2, letter: 2, rule: 'hafs_special' }],
    },
  ],
  reviewed: false,
}
