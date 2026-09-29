import type { Lesson } from './types'

export const ghunnahLesson: Lesson = {
  id: 'ghunnah',
  order: 4,
  unit: 'ghunnah-meem',
  title: { ar: 'الغنة في النون والميم المشددتين', en: 'Ghunnah on noon and meem with a shaddah' },
  summary: {
    ar: 'كل نون أو ميم عليها شدة تُقرأ بغنة كاملة مقدارها حركتان.',
    en: 'Every noon or meem carrying a shaddah is pronounced with a full ghunnah of two counts.',
  },
  sections: [
    {
      body: {
        ar: 'الغنة صوت لطيف يخرج من الخيشوم، أي من الأنف، وهي صفة ثابتة للنون والميم. وتظهر أكمل ما تكون في النون والميم المشددتين.',
        en: 'The ghunnah is a soft, nasal hum that comes from the khayshum, the nose. It always goes with noon and meem, and it is fullest when they carry a shaddah.',
      },
    },
    {
      heading: { ar: 'الحكم', en: 'The rule' },
      body: {
        ar: 'إذا جاءت نون أو ميم عليها شدة وجب إظهار غنتها كاملة، ومقدارها حركتان، سواء وقعت في وسط الكلمة أو في آخرها، وسواء وصلت القارئ بما بعدها أو وقف عليها. وتُسمّى كل واحدة منهما حرف غنة.',
        en: 'When a noon or a meem carries a shaddah, its ghunnah must be pronounced in full, for two counts. This holds in the middle or at the end of a word, and whether the reciter continues or stops on it. Each of them is called a ghunnah letter.',
      },
    },
    {
      heading: { ar: 'كيف تعدّها؟', en: 'How to count it' },
      body: {
        ar: 'اضغط زر التشغيل، وانطق النون المشددة أو الميم المشددة، واترك صوتها يخرج من الأنف بمقدار حركتين، ثم توقف. لا تُطِل الغنة أكثر من ذلك ولا تقصّرها. الحركتان هنا بنفس مقدار حركتي المد الطبيعي.',
        en: 'Press play, pronounce the noon or meem with its shaddah, and let its sound hum through the nose for two counts, then stop. Do not stretch the ghunnah beyond that, and do not cut it short. The two counts are the same length as the two counts of a natural madd.',
      },
      animation: 'ghunnah',
    },
    {
      heading: { ar: 'ما يميز الغنة', en: 'What to watch for' },
      body: {
        ar: 'الغنة صفة النون والميم، فلا تُخرَج من الفم وحده. وإذا أمسكت أنفك أثناء نطقها تحسّ أن الصوت انقطع. وتلوَّن الغنة في المصحف الملوّن باللون الأخضر.',
        en: 'The ghunnah is a quality of noon and meem, so it is not made in the mouth alone. If you hold your nose while pronouncing it, you feel the sound is cut off. In a color-coded mushaf, the ghunnah is colored green.',
      },
    },
  ],
  focusRules: ['ghunnah'],
  examples: [
    {
      verseKey: '108:1',
      note: {
        ar: 'النون المشددة في الكلمة الأولى: غنة حركتان.',
        en: 'The noon with a shaddah in the first word: a ghunnah of two counts.',
      },
    },
    {
      verseKey: '78:1',
      note: {
        ar: 'الميم المشددة في الكلمة الأولى: غنة حركتان.',
        en: 'The meem with a shaddah in the first word: a ghunnah of two counts.',
      },
    },
    {
      verseKey: '114:6',
      note: {
        ar: 'نونان مشددتان في هذه الآية، في الكلمة الثانية وفي الأخيرة: لكل منهما غنة كاملة حركتان.',
        en: 'Two noons with a shaddah in this ayah, in the second word and in the last: each gets a full ghunnah of two counts.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 17,
        note: {
          ar: 'يأمر بالغنة على الميم والنون المشددتين، ويسمّي كل واحد منهما حرف غنة.',
          en: 'It tells the reader to pronounce the ghunnah on a doubled meem and noon, and names each of them a ghunnah letter.',
        },
      },
    ],
    jazariyya: [
      {
        from: 62,
        note: {
          ar: 'صدر البيت: إظهار الغنة من النون والميم إذا شُدِّدتا. أما عجزه فيبدأ حكم الميم الساكنة وهو من درس لاحق.',
          en: 'The first half of the line: show the ghunnah of noon and meem when they carry a shaddah. Its second half begins the ruling on meem sakinah, a later lesson.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي فيه غنة في هذه الآية.',
        en: 'Tap the letter in this ayah that carries the ghunnah.',
      },
      verseKey: '108:1',
      rule: 'ghunnah',
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم مقدار الغنة في النون والميم المشددتين؟', en: 'How long is the ghunnah on a noon or meem with a shaddah?' },
      options: [
        { ar: 'حركة واحدة', en: '1 count' },
        { ar: 'حركتان', en: '2 counts' },
        { ar: 'أربع حركات', en: '4 counts' },
        { ar: 'ست حركات', en: '6 counts' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الغنة في النون والميم المشددتين حركتان دائمًا.',
        en: 'The ghunnah on a noon or meem with a shaddah is always two counts.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'من أين يخرج صوت الغنة؟', en: 'Where does the sound of the ghunnah come from?' },
      options: [
        { ar: 'من الخيشوم (الأنف)', en: 'The khayshum (the nose)' },
        { ar: 'من الشفتين فقط', en: 'The lips only' },
        { ar: 'من أقصى الحلق', en: 'The deepest part of the throat' },
        { ar: 'من وسط اللسان', en: 'The middle of the tongue' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الغنة صوت يخرج من الخيشوم.',
        en: 'The ghunnah is a sound that comes from the khayshum.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي حرفين يجب إظهار غنتهما إذا كان عليهما شدة؟',
        en: 'Which two letters must show their ghunnah when they carry a shaddah?',
      },
      options: [
        { ar: 'النون والميم', en: 'Noon and meem' },
        { ar: 'الباء والتاء', en: 'Ba and ta' },
        { ar: 'اللام والراء', en: 'Lam and ra' },
        { ar: 'القاف والكاف', en: 'Qaf and kaf' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'النون والميم المشددتان حرفا غنة.',
        en: 'A doubled noon or meem is a ghunnah letter.',
      },
    },
  ],
  reviewed: false,
}
