import type { Lesson } from './types'

export const iqlab: Lesson = {
  id: 'iqlab',
  order: 3.2,
  unit: 'noon-sakinah',
  title: { ar: 'الإقلاب', en: 'Iqlab (the noon turns into a meem)' },
  summary: {
    ar: 'النون الساكنة أو التنوين قبل الباء تنقلب ميمًا مخفاة بغنة.',
    en: 'A noon sakinah or tanween before ba turns into a hidden meem, with a ghunnah.',
  },
  sections: [
    {
      body: {
        ar: 'الإقلاب: إذا جاء بعد النون الساكنة أو التنوين حرف الباء، قُلبت النون ميمًا مخفاة مع الغنة. حرفه واحد فقط: الباء.',
        en: 'Iqlab: when a noon sakinah or tanween is followed by the letter ba, the noon is changed into a hidden meem, with ghunnah. It has only one letter: ba.',
      },
      animation: 'iqlab-meem',
    },
    {
      heading: { ar: 'كيف تنطقه؟', en: 'How to say it' },
      body: {
        ar: 'أطبق الشفتين إطباقًا خفيفًا، من غير أن تضغط عليهما، وأخرج الغنة من الأنف بمقدار حركتين، ثم انطق الباء. لا تُظهر النون ولا تُدغمها.',
        en: 'Close the lips lightly, without pressing them, let the ghunnah come through the nose for two counts, then say the ba. Do not pronounce the noon clearly, and do not merge it.',
      },
    },
    {
      heading: { ar: 'في المصحف', en: 'In the mushaf' },
      body: {
        ar: 'توضع ميم صغيرة فوق النون الساكنة أو التنوين علامةً على الإقلاب، فتعلم أن النون لا تُنطق نونًا بل ميمًا مخفاة.',
        en: 'A small meem is written above the noon sakinah or the tanween as the sign of iqlab. It tells you the noon is not said as a noon but as a hidden meem.',
      },
    },
    {
      heading: { ar: 'في الكلمة وبين الكلمتين', en: 'Inside a word and across words' },
      body: {
        ar: 'قد تجتمع النون الساكنة مع الباء في كلمة واحدة، وقد تكون النون أو التنوين في آخر كلمة والباء في أول التي بعدها؛ والحكم واحد.',
        en: 'The noon sakinah and the ba can meet inside one word, or the noon or tanween can end a word with the ba starting the next. The rule is the same.',
      },
    },
  ],
  animation: 'iqlab-meem',
  focusRules: ['iqlab'],
  examples: [
    {
      verseKey: '80:27',
      note: {
        ar: 'نون ساكنة وباء في كلمة واحدة، وهما الحرفان الملوَّنان.',
        en: 'A noon sakinah and a ba inside one word: the two colored letters.',
      },
    },
    {
      verseKey: '92:8',
      note: {
        ar: 'نون ساكنة في آخر كلمة، وباء في أول الكلمة التالية.',
        en: 'A noon sakinah ends one word, and a ba starts the next.',
      },
    },
    {
      verseKey: '69:8',
      note: {
        ar: 'نون ساكنة في آخر «مِن» قبل الباء في الكلمة التي بعدها.',
        en: 'A noon sakinah at the end of a short word, before the ba that starts the next.',
      },
    },
    {
      verseKey: '70:1',
      note: {
        ar: 'تنوين ضمّ في آخر كلمة قبل الباء.',
        en: 'Tanween of damma at the end of a word, before a ba.',
      },
    },
    {
      verseKey: '74:38',
      note: {
        ar: 'تنوين كسر في آخر كلمة قبل الباء.',
        en: 'Tanween of kasra at the end of a word, before a ba.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 13,
        note: {
          ar: 'الحكم الثالث من أحكام النون الساكنة والتنوين: الإقلاب عند الباء، تُقلب النون ميمًا بغنة مع الإخفاء.',
          en: 'The third rule of noon sakinah and tanween: iqlab before ba, the noon becomes a meem with ghunnah and a hidden sound.',
        },
      },
    ],
    jazariyya: [
      {
        from: 68,
        note: {
          ar: 'القلب عند الباء بغنة، أي تنقلب النون ميمًا.',
          en: 'The conversion before ba, with ghunnah: the noon becomes a meem.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على حروف الإقلاب في هذه الآية.',
        en: 'Tap the letters with iqlab in this ayah.',
      },
      verseKey: '92:8',
      rule: 'iqlab',
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الحرف الذي يقع الإقلاب عنده؟', en: 'Which letter causes iqlab?' },
      options: [
        { ar: 'الباء', en: 'Ba' },
        { ar: 'الميم', en: 'Meem' },
        { ar: 'الفاء', en: 'Fa' },
        { ar: 'اللام', en: 'Lam' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الإقلاب له حرف واحد هو الباء.',
        en: 'Iqlab has exactly one letter: ba.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يحدث للنون في الإقلاب؟', en: 'What happens to the noon in iqlab?' },
      options: [
        { ar: 'تظهر واضحة', en: 'It is pronounced clearly' },
        { ar: 'تدغم في الباء', en: 'It merges into the ba' },
        { ar: 'تنقلب ميمًا مخفاة بغنة', en: 'It turns into a hidden meem with ghunnah' },
        { ar: 'تحذف بلا غنة', en: 'It is dropped with no ghunnah' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'تُقلب النون ميمًا مخفاة، وتخرج الغنة مقدار حركتين.',
        en: 'The noon becomes a hidden meem, and the ghunnah lasts two counts.',
      },
    },
  ],
  reviewed: false,
}
