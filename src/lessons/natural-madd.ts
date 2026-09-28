import type { Lesson } from './types'

export const naturalMadd: Lesson = {
  id: 'natural-madd',
  order: 13,
  title: { ar: 'المد الطبيعي', en: 'Natural madd (al-madd al-tabi’i)' },
  summary: {
    ar: 'إطالة الصوت حركتين على أحد حروف المد الثلاثة، من غير همزة أو سكون بعده.',
    en: 'Stretching the sound two counts on one of the three madd letters, with no hamza or sukun right after it.',
  },
  sections: [
    {
      body: {
        ar: 'المدّ هو إطالة الصوت بحرف من حروف المدّ. المدّ الطبيعي هو أصل المدود كلّها: لا يحتاج إلى سبب زائد (همزة أو سكون)، ومقداره ثابت دائمًا حركتان.',
        en: 'Madd is stretching the sound on a madd letter. Natural madd is the root of every other madd: it needs no extra cause (a hamza or a sukun), and its length is always exactly two counts.',
      },
    },
    {
      heading: { ar: 'حروف المدّ', en: 'The madd letters' },
      body: {
        ar: 'حروف المدّ ثلاثة، وكل واحد منها لا يمدّ إلا مع الحركة التي تناسبه قبله: الألف الساكنة وقبلها فتحة (ـَا)، الواو الساكنة وقبلها ضمة (ـُو)، الياء الساكنة وقبلها كسرة (ـِي). وفي المصحف تُكتب الألف أحيانًا ألفًا صغيرة فوق الحرف (ـٰ)، وحكمها حكم الألف.',
        en: 'There are three madd letters, and each one only stretches with the harakah that matches it right before: alif preceded by fatha (ـَا), waw sakinah preceded by damma (ـُو), and ya sakinah preceded by kasra (ـِي). In the mushaf the alif is often written as a small alif above the letter (ـٰ); it is read just like a full alif.',
      },
    },
    {
      heading: { ar: 'شرطه', en: 'Its condition' },
      body: {
        ar: 'يكون المدّ طبيعيًا ما دام حرف المدّ ليس بعده همزة ولا سكون. فإن جاء بعده همزة صار مدًا فرعيًا (واجبًا أو جائزًا)، وإن جاء بعده سكون أصلي صار مدًا لازمًا، وإن كان السكون بسبب الوقف صار مدًا عارضًا للسكون — وكل ذلك في دروس لاحقة.',
        en: 'A madd stays natural as long as nothing but the madd letter follows — no hamza and no sukun right after it. If a hamza follows, it becomes a longer, secondary madd (obligatory or permissible); if a permanent sukun follows, it becomes a necessary madd (lazim), and if the sukun only comes from stopping, it becomes a madd ʿarid lis-sukun. These are covered in later lessons.',
      },
    },
    {
      heading: { ar: 'كيف تُحسب الحركة؟', en: 'How to count a harakah' },
      body: {
        ar: 'الحركة هي أصغر وحدة زمنية في التجويد، بمقدار نطق حرف متحرك واحد — أو بمقدار فتح إصبع أو قبضه. المدّ الطبيعي حركتان، أي بمقدار فتح إصبعين أو قبضهما، لا أكثر ولا أقل.',
        en: 'A harakah is the smallest unit of timing in tajweed, roughly the time it takes to pronounce one moving letter, or to open or close one finger while counting. Natural madd is two counts — about the time of opening or closing two fingers, no more and no less.',
      },
    },
  ],
  animation: 'natural-madd',
  focusRules: ['madda_normal'],
  examples: [
    {
      verseKey: '1:1',
      note: {
        ar: 'المدّ الطبيعي الملوَّن هنا ألف صغيرة (ـٰ) بعد فتحة: حركتان. أما الياء في آخر الآية فغير ملوّنة هنا، لأن الوقف عليها يجعلها مدًا عارضًا للسكون (درس لاحق).',
        en: 'The colored natural madd here is a small alif (ـٰ) after a fatha: two counts. The ya at the end of the ayah is not colored here, because stopping on it makes it a madd ʿarid lis-sukun (a later lesson).',
      },
    },
    {
      verseKey: '1:2',
      note: {
        ar: 'ألف صغيرة (ـٰ) بعد فتحة في الكلمة الأخيرة: مدّ طبيعي بمقدار حركتين.',
        en: 'A small alif (ـٰ) after a fatha in the last word: a natural madd of two counts.',
      },
    },
    {
      verseKey: '97:1',
      note: {
        ar: 'المدّ الطبيعي في الكلمة الثانية. أما الكلمة الأولى فمدّها أطول لأن بعده همزة (درس لاحق).',
        en: 'The natural madd is in the second word. The first word has a longer madd because a hamza follows it (a later lesson).',
      },
    },
  ],
  mutoon: [
    {
      text: 'tuhfa',
      from: 35,
      to: 41,
      note: {
        ar: 'تُعرِّف هذه الأبيات المدّ الطبيعي بأنه ما لا يحتاج إلى سبب زائد (همز أو سكون)، وتذكر حروف المدّ الثلاثة وشرط كل حرف منها.',
        en: 'These lines define natural madd as needing no extra cause (a hamza or a sukun), then name the three madd letters and the condition — the harakah right before each — that makes it a madd letter.',
      },
    },
  ],
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي فيه مدّ طبيعي في هذه الآية.',
        en: 'Tap the letter in this ayah that has a natural madd.',
      },
      verseKey: '1:2',
      rule: 'madda_normal',
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم عدد حركات المدّ الطبيعي؟', en: 'How many counts does natural madd have?' },
      options: [
        { ar: '١', en: '1' },
        { ar: '٢', en: '2' },
        { ar: '٤', en: '4' },
        { ar: '٦', en: '6' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'المدّ الطبيعي دائمًا حركتان، لا يزيد ولا ينقص.',
        en: 'Natural madd is always exactly two counts, never more or less.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما هي حروف المدّ الثلاثة؟', en: 'What are the three madd letters?' },
      options: [
        { ar: 'ا و ي', en: 'ا و ي (alif, waw, ya)' },
        { ar: 'ق ط ب ج د', en: 'ق ط ب ج د' },
        { ar: 'م ن', en: 'م ن' },
        { ar: 'ء ه ع ح', en: 'ء ه ع ح' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'حروف المدّ هي الألف الساكنة بعد فتحة، والواو الساكنة بعد ضمة، والياء الساكنة بعد كسرة.',
        en: 'The madd letters are alif sakinah after fatha, waw sakinah after damma, and ya sakinah after kasra.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'متى لا يكون مدّ حرف المدّ مدًا طبيعيًا؟',
        en: 'When does a madd letter NOT make a natural madd?',
      },
      options: [
        { ar: 'عندما يكون في أول الكلمة', en: 'When it is at the start of a word' },
        { ar: 'عندما يأتي بعده همزة أو سكون', en: 'When a hamza or a sukun follows it' },
        { ar: 'عندما تكون الآية طويلة', en: 'When the ayah is long' },
        { ar: 'عندما يُقرأ بصوت مرتفع', en: 'When it is recited aloud' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'إذا جاء بعد حرف المدّ همزة أو سكون فهو مدّ فرعي (واجب أو جائز أو لازم أو عارض للسكون)، لا مدّ طبيعي.',
        en: 'If a hamza or a sukun follows the madd letter, it becomes a secondary madd (obligatory, permissible, necessary, or ʿarid lis-sukun), not a natural one.',
      },
    },
  ],
  reviewed: false,
}
