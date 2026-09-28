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
        ar: 'حروف المدّ ثلاثة، وكل واحد منها لا يمدّ إلا مع الحركة التي تناسبه قبله: الألف الساكنة وقبلها فتحة (ـَا)، الواو الساكنة وقبلها ضمة (ـُو)، الياء الساكنة وقبلها كسرة (ـِي).',
        en: 'There are three madd letters, and each one only stretches with the harakah that matches it right before: alif preceded by fatha (ـَا), waw sakinah preceded by damma (ـُو), and ya sakinah preceded by kasra (ـِي).',
      },
    },
    {
      heading: { ar: 'شرطه', en: 'Its condition' },
      body: {
        ar: 'يكون المدّ طبيعيًا ما دام حرف المدّ ليس بعده همزة ولا سكون. فإن جاء بعده همزة صار مدًا فرعيًا (واجبًا أو جائزًا)، وإن جاء بعده حرف ساكن صار مدًا لازمًا — وهذان يأتيان في دروس لاحقة.',
        en: 'A madd stays natural as long as nothing but the madd letter follows — no hamza and no sukun right after it. If a hamza follows, it becomes a longer, secondary madd (obligatory or permissible); if a sukun follows, it becomes a necessary madd — both are covered in later lessons.',
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
        ar: 'لاحظ حرف المدّ الطبيعي في «الرَّحْمَـٰنِ» — ألف بعد فتحة.',
        en: 'Notice the natural madd letter in "ar-Rahman" — alif after fatha.',
      },
    },
    {
      verseKey: '1:2',
      note: {
        ar: 'لاحظ حرف المدّ الطبيعي في «الْعَالَمِينَ» — ألف بعد فتحة.',
        en: 'Notice the natural madd letter in "al-’alamin" — alif after fatha.',
      },
    },
    {
      verseKey: '97:1',
      note: {
        ar: 'لاحظ حرف المدّ الطبيعي في «أَنزَلْنَـٰهُ» في أول سورة القدر.',
        en: 'Notice the natural madd letter in "anzalnahu", at the start of surah al-Qadr.',
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
        ar: 'إذا جاء بعد حرف المدّ همزة أو سكون فهو مدّ فرعي (واجب أو جائز أو لازم)، لا مدّ طبيعي.',
        en: 'If a hamza or a sukun follows the madd letter, it becomes a secondary madd (obligatory, permissible, or necessary), not a natural one.',
      },
    },
  ],
  reviewed: false,
}
