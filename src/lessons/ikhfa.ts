import type { Lesson } from './types'

export const ikhfa: Lesson = {
  id: 'ikhfa',
  order: 7,
  unit: 'noon-sakinah',
  title: { ar: 'الإخفاء الحقيقي', en: 'Ikhfa (hiding the noon)' },
  summary: {
    ar: 'تُنطق النون الساكنة أو التنوين بغنة حركتين، والنون مخفاة، قبل خمسة عشر حرفًا.',
    en: 'A noon sakinah or tanween is hidden, with a two-count ghunnah, before fifteen letters.',
  },
  sections: [
    {
      body: {
        ar: 'الإخفاء: النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام، عارٍ من التشديد، مع بقاء الغنة، وذلك إذا جاء بعدهما أحد حروف الإخفاء.',
        en: 'Ikhfa is pronouncing a noon sakinah or tanween in a way that lies between izhar and idgham: without shaddah, with the ghunnah kept, when one of the ikhfa letters follows.',
      },
      animation: 'ikhfa-hidden',
    },
    {
      heading: { ar: 'حروفه', en: 'Its letters' },
      body: {
        ar: 'حروف الإخفاء خمسة عشر، هي بقية الحروف بعد حروف الإظهار الستة وحروف الإدغام الستة وحرف الإقلاب: ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ.',
        en: 'There are fifteen ikhfa letters: all those left after the six izhar letters, the six idgham letters and the iqlab letter: ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ.',
      },
    },
    {
      heading: { ar: 'كيف ننطقه؟', en: 'How to say it' },
      body: {
        ar: 'لا يلمس اللسان مخرج النون، بل يتهيأ لمخرج الحرف التالي، ويخرج الصوت من الخيشوم بغنة مقدارها حركتان. وتكون الغنة مفخّمة قبل حروف الاستعلاء (ص ض ط ظ ق)، ومرقّقة قبل غيرها.',
        en: 'The tongue does not touch the noon’s spot; it gets ready for the next letter’s spot while the sound comes through the nose as a ghunnah of two counts. The ghunnah is full (tafkhim) before the heavy letters (ص ض ط ظ ق) and light (tarqiq) before the rest.',
      },
    },
    {
      heading: { ar: 'ملخص أحكام النون الساكنة والتنوين', en: 'The four rules in short' },
      body: {
        ar: 'الإظهار: عند حروف الحلق الستة، واضحة بلا غنة. الإدغام: عند ي ر م ل و ن، تدخل النون في الحرف التالي. الإقلاب: عند الباء، تُقلب ميمًا مخفاة بغنة. الإخفاء: عند الحروف الخمسة عشر الباقية، تختفي النون مع غنة حركتين.',
        en: 'Izhar: before the six throat letters, clear, with no ghunnah. Idgham: before ي ر م ل و ن, the noon merges into the next letter. Iqlab: before ب, it turns into a hidden meem with ghunnah. Ikhfa: before the fifteen remaining letters, the noon hides, with a two-count ghunnah.',
      },
    },
  ],
  animation: 'ikhfa-hidden',
  focusRules: ['ikhafa'],
  examples: [
    {
      verseKey: '109:3',
      note: {
        ar: 'نون ساكنة في وسط الكلمة يليها حرف من حروف الإخفاء: انظر إلى الحرف الملوَّن.',
        en: 'A noon sakinah in the middle of a word, followed by an ikhfa letter: see the colored letter.',
      },
    },
    {
      verseKey: '113:2',
      note: {
        ar: 'نون ساكنة في آخر كلمة والحرف التالي في أول الكلمة التي بعدها.',
        en: 'A noon sakinah at the end of a word, with the ikhfa letter at the start of the next.',
      },
    },
    {
      verseKey: '111:3',
      note: {
        ar: 'هنا تنوين قبل حرف الإخفاء، وحكمه حكم النون الساكنة.',
        en: 'Here tanween comes before an ikhfa letter, and it follows the same rule as a noon sakinah.',
      },
    },
    {
      verseKey: '94:7',
      note: {
        ar: 'نون ساكنة أخرى قبل حرف من حروف الإخفاء؛ لاحظ الحرف الملوَّن.',
        en: 'Another noon sakinah before an ikhfa letter; notice the colored letter.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 14,
        note: {
          ar: 'الحكم الرابع من أحكام النون الساكنة والتنوين هو الإخفاء، عند الحروف الخمسة عشر.',
          en: 'The fourth rule of noon sakinah and tanween is ikhfa, before the fifteen letters.',
        },
      },
      {
        from: 15,
        to: 16,
        note: {
          ar: 'يعدّ الناظم الحروف الخمسة عشر بأوائل كلمات البيت الثاني.',
          en: 'The poet gathers the fifteen letters as the first letters of the words of the second line.',
        },
      },
    ],
    jazariyya: [
      {
        from: 65,
        note: {
          ar: 'يجمل الأحكام الأربعة، ومنها الإخفاء.',
          en: 'It names the four rules together, ikhfa among them.',
        },
      },
      {
        from: 68,
        note: {
          ar: 'الإخفاء عند باقي الحروف بعد الحلق والإدغام والإقلاب.',
          en: 'Ikhfa is for the letters left after the throat letters, idgham and iqlab.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي فيه إخفاء في هذه الآية.',
        en: 'Tap the letter that carries ikhfa in this ayah.',
      },
      verseKey: '113:2',
      rule: 'ikhafa',
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم عدد حروف الإخفاء؟', en: 'How many ikhfa letters are there?' },
      options: [
        { ar: '٦', en: '6' },
        { ar: '١٥', en: '15' },
        { ar: '١٧', en: '17' },
        { ar: '٢٨', en: '28' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'حروف الإخفاء خمسة عشر، وهي ما بقي بعد حروف الإظهار والإدغام والإقلاب.',
        en: 'There are fifteen: the letters left after those of izhar, idgham and iqlab.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم مقدار الغنة في الإخفاء؟', en: 'How long is the ghunnah in ikhfa?' },
      options: [
        { ar: 'حركتان', en: '2 counts' },
        { ar: 'أربع حركات', en: '4 counts' },
        { ar: 'ست حركات', en: '6 counts' },
        { ar: 'لا غنة فيه', en: 'None' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الغنة في الإخفاء حركتان.',
        en: 'The ghunnah in ikhfa is two counts.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ماذا يفعل اللسان في الإخفاء؟',
        en: 'What does the tongue do in ikhfa?',
      },
      options: [
        { ar: 'يلمس مخرج النون بقوة', en: 'Touches the noon’s spot firmly' },
        { ar: 'يتهيأ لمخرج الحرف التالي دون أن يلمسه', en: 'Gets ready for the next letter’s spot without touching it' },
        { ar: 'يلتصق بالحرف التالي ويشدده', en: 'Sticks to the next letter and doubles it' },
        { ar: 'لا يتحرك أبدًا', en: 'Never moves' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'تختفي النون ويتجه اللسان إلى مخرج الحرف التالي من غير أن يلمس مخرج النون.',
        en: 'The noon hides while the tongue heads to the next letter’s spot, without touching the noon’s.',
      },
    },
  ],
  reviewed: false,
}
