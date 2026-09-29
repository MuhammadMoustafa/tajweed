import type { Lesson } from './types'

export const izhar: Lesson = {
  id: 'izhar',
  order: 3,
  unit: 'noon-sakinah',
  title: { ar: 'النون الساكنة والتنوين: الإظهار الحلقي', en: 'Noon sakinah and tanween: izhar halqi' },
  summary: {
    ar: 'أحكام النون الساكنة والتنوين أربعة، أولها الإظهار: نطق النون واضحًا قبل حروف الحلق الستة.',
    en: 'Noon sakinah and tanween have four rules; the first is izhar, saying the noon clearly before the six throat letters.',
  },
  sections: [
    {
      heading: { ar: 'ما هما؟', en: 'What are they?' },
      body: {
        ar: 'النون الساكنة هي النون التي عليها سكون وتثبت في الوصل والوقف، مثل نون «مِنْ». والتنوين نون ساكنة زائدة تلحق آخر الاسم في النطق لا في الكتابة، وترمز إليها الفتحتان أو الضمتان أو الكسرتان.',
        en: 'A noon sakinah is a noon with a sukun, which stays when reading on or stopping. Tanween is an extra silent noon added to the end of a noun in pronunciation, not in writing; the double fatha, double damma or double kasra stands for it.',
      },
    },
    {
      heading: { ar: 'أحكامها الأربعة', en: 'Their four rules' },
      body: {
        ar: 'لها بحسب الحرف الذي بعدها أربعة أحكام: الإظهار، والإدغام، والإقلاب، والإخفاء. نتعلمها واحدًا واحدًا، وهذا الدرس في الإظهار.',
        en: 'Depending on the letter that comes after, they follow one of four rules: izhar, idgham, iqlab and ikhfa. We learn them one at a time; this lesson is izhar.',
      },
    },
    {
      heading: { ar: 'الإظهار الحلقي', en: 'Izhar halqi' },
      body: {
        ar: 'الإظهار معناه البيان. فإذا جاء بعد النون الساكنة أو التنوين حرف من حروف الحلق الستة، نطقنا النون واضحة من غير إدغام ولا إخفاء، ومن غير إطالة غنتها.',
        en: 'Izhar means making clear. When a noon sakinah or tanween is followed by one of the six throat letters, we pronounce the noon clearly, with no merging and no hiding, and without stretching its ghunnah.',
      },
    },
    {
      heading: { ar: 'حروفه', en: 'Its letters' },
      body: {
        ar: 'حروف الحلق ستة: الهمزة والهاء والعين والحاء والغين والخاء (ء هـ ع ح غ خ). وسُمّي حلقيًا لأن هذه الحروف تخرج من الحلق، وهو بعيد عن مخرج النون، فلا تلتبس بها.',
        en: 'The throat letters are six: hamza, ha, ain, ha, ghain and kha (ء هـ ع ح غ خ). It is called halqi (of the throat) because these letters are made in the throat, far from the noon’s place, so the two do not blend.',
      },
    },
    {
      heading: { ar: 'في كلمة وفي كلمتين', en: 'In one word and across two' },
      body: {
        ar: 'يقع الإظهار إذا كانت النون وحرف الحلق في كلمة واحدة، أو كانت النون في آخر كلمة وحرف الحلق في أول التي بعدها. أما التنوين فلا يكون إلا في آخر الكلمة، فحرف الحلق بعده في أول الكلمة التالية.',
        en: 'Izhar happens when the noon and the throat letter are in one word, or when the noon ends a word and the throat letter begins the next. Tanween is always at the end of a word, so its throat letter begins the next word.',
      },
    },
  ],
  animation: 'izhar-clip',
  focusRules: ['izhar'],
  examples: [
    {
      verseKey: '1:7',
      marks: [
        { word: 3, letter: 2, rule: 'izhar' },
        { word: 3, letter: 3, rule: 'izhar' },
      ],
      note: {
        ar: 'في الكلمة الثالثة نون ساكنة يليها حرف حلقي في الكلمة نفسها؛ الملوَّنان هما النون والحرف الحلقي.',
        en: 'In the third word a noon sakinah is followed by a throat letter in the same word; the two colored letters are the noon and the throat letter.',
      },
    },
    {
      verseKey: '96:2',
      marks: [
        { word: 3, letter: 2, rule: 'izhar' },
        { word: 4, letter: 1, rule: 'izhar' },
      ],
      note: {
        ar: 'نون ساكنة في آخر الكلمة الثالثة، وحرف الحلق في أول الكلمة الرابعة.',
        en: 'A noon sakinah ends the third word and a throat letter begins the fourth.',
      },
    },
    {
      verseKey: '106:4',
      marks: [
        { word: 6, letter: 2, rule: 'izhar' },
        { word: 7, letter: 1, rule: 'izhar' },
      ],
      note: {
        ar: 'إظهار بين الكلمتين السادسة والسابعة. أما النون في الكلمة الثالثة فبعدها حرف آخر، وسيأتي حكمها في درس لاحق.',
        en: 'Izhar between the sixth and seventh words. The noon in the third word is followed by a different letter; its rule comes in a later lesson.',
      },
    },
    {
      verseKey: '101:11',
      marks: [
        { word: 1, letter: 3, rule: 'izhar' },
        { word: 2, letter: 1, rule: 'izhar' },
      ],
      note: {
        ar: 'إظهار مع التنوين: الحرف الأول الملوَّن عليه تنوين، ويليه في الكلمة التالية حرف حلقي.',
        en: 'Izhar with tanween: the first colored letter carries tanween and the next word begins with a throat letter.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 6,
        note: {
          ar: 'يفتتح الباب: للنون الساكنة والتنوين أربعة أحكام.',
          en: 'Opens the chapter: noon sakinah and tanween have four rules.',
        },
      },
      {
        from: 7,
        to: 8,
        note: {
          ar: 'الحكم الأول الإظهار، وذلك قبل ستة أحرف حلقية، وقد عدّها: الهمزة والهاء والعين والحاء المهملة والغين والخاء.',
          en: 'The first rule is izhar, before the six throat letters, which the lines then list: hamza, ha, ain, unpointed ha, ghain and kha.',
        },
      },
    ],
    jazariyya: [
      {
        from: 65,
        note: {
          ar: 'يجمع الأحكام الأربعة للتنوين والنون الساكنة: الإظهار والإدغام والقلب والإخفاء.',
          en: 'Gathers the four rules of tanween and noon sakinah: izhar, idgham, iqlab and ikhfa.',
        },
      },
      {
        from: 66,
        note: {
          ar: 'في صدره الإظهار عند حرف الحلق؛ وعجزه في الإدغام، وسيأتي.',
          en: 'Its first half is izhar at a throat letter; its second half is about idgham, which comes later.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على النون الساكنة وحرف الحلق بعدها.',
        en: 'Tap the noon sakinah and the throat letter after it.',
      },
      verseKey: '96:2',
      rule: 'izhar',
      marks: [
        { word: 3, letter: 2, rule: 'izhar' },
        { word: 4, letter: 1, rule: 'izhar' },
      ],
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم حرفًا من حروف الحلق؟', en: 'How many throat letters are there?' },
      options: [
        { ar: '٤', en: '4' },
        { ar: '٥', en: '5' },
        { ar: '٦', en: '6' },
        { ar: '٨', en: '8' },
      ],
      correctIndex: 2,
      explanation: { ar: 'ستة: ء هـ ع ح غ خ.', en: 'Six: ء هـ ع ح غ خ.' },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا نفعل بالنون في الإظهار؟', en: 'What do we do with the noon in izhar?' },
      options: [
        { ar: 'ندغمها في الحرف بعدها', en: 'Merge it into the next letter' },
        { ar: 'ننطقها واضحة من غير غنة مطوّلة', en: 'Say it clearly, without a stretched ghunnah' },
        { ar: 'نقلبها ميمًا', en: 'Turn it into a meem' },
        { ar: 'نخفيها', en: 'Hide it' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الإظهار: نطق النون واضحة قبل حروف الحلق.',
        en: 'Izhar is saying the noon clearly before a throat letter.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم حكمًا للنون الساكنة والتنوين؟', en: 'How many rules do noon sakinah and tanween have?' },
      options: [
        { ar: '٢', en: '2' },
        { ar: '٣', en: '3' },
        { ar: '٤', en: '4' },
        { ar: '٦', en: '6' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'أربعة: الإظهار والإدغام والإقلاب والإخفاء.',
        en: 'Four: izhar, idgham, iqlab and ikhfa.',
      },
    },
  ],
  reviewed: false,
}
