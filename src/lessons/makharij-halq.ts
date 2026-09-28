import type { Lesson } from './types'

export const makharijHalq: Lesson = {
  id: 'makharij-halq',
  order: 2.2,
  unit: 'makharij',
  title: { ar: 'مخارج الحروف: الحلق', en: 'Makharij: al-halq (the throat)' },
  summary: {
    ar: 'في الحلق ثلاثة مخارج لستة حروف: ء ه، ثم ع ح، ثم غ خ.',
    en: 'The throat has three makharij for six letters: hamzah and ha, then ʿayn and ḥa, then ghayn and kha.',
  },
  sections: [
    {
      body: {
        ar: 'في الحلق ثلاثة مخارج، لكل مخرج حرفان، فهي ستة حروف تسمّى الحروف الحلقية. نبدأ من أبعدها عن الفم إلى أقربها إليه.',
        en: 'The throat has three makharij with two letters each: six letters in all, called the throat letters. We go from the point farthest from the mouth to the nearest.',
      },
    },
    {
      heading: { ar: '١. أقصى الحلق: ء ه', en: '1. The deepest part of the throat: ء ه' },
      body: {
        ar: 'من أقصى الحلق، أي أبعده عن الفم مما يلي الصدر، تخرج الهمزة ثم الهاء.',
        en: 'Hamzah and then ha come from the deepest part of the throat, the part farthest from the mouth, next to the chest.',
      },
    },
    {
      heading: { ar: '٢. وسط الحلق: ع ح', en: '2. The middle of the throat: ع ح' },
      body: {
        ar: 'من وسط الحلق تخرج العين ثم الحاء.',
        en: 'ʿAyn and then ḥa come from the middle of the throat.',
      },
    },
    {
      heading: { ar: '٣. أدنى الحلق: غ خ', en: '3. The nearest part of the throat: غ خ' },
      body: {
        ar: 'من أدنى الحلق، أي أقربه إلى الفم، تخرج الغين ثم الخاء.',
        en: 'Ghayn and then kha come from the nearest part of the throat, the part closest to the mouth.',
      },
    },
    {
      heading: { ar: 'انتبه', en: 'Watch out' },
      body: {
        ar: 'لا تخلط العين بالهمزة، ولا الحاء بالهاء: الهمزة والهاء من أقصى الحلق، والعين والحاء من وسطه. وستلقى هذه الحروف الستة مرة أخرى في درس الإظهار، فهي حروف الإظهار الحلقي.',
        en: 'Don\'t mix up ʿayn with hamzah, or ḥa with ha: hamzah and ha come from the deepest part of the throat, ʿayn and ḥa from its middle. You will meet these six letters again in the izhar lesson: they are the letters of throat izhar.',
      },
    },
  ],
  animation: 'makharij-halq',
  // No rule is colored here: the notes point at the throat letters and where they come from.
  focusRules: [],
  examples: [
    {
      verseKey: '112:1',
      note: {
        ar: 'الهاء في أول الكلمة الثانية والهمزة في أول الكلمة الأخيرة من أقصى الحلق، والحاء في الكلمة الأخيرة من وسطه.',
        en: 'The ha at the start of the second word and the hamzah at the start of the last word come from the deepest part of the throat; the ḥa in the last word comes from its middle.',
      },
    },
    {
      verseKey: '1:2',
      note: {
        ar: 'الحاء في الكلمة الأولى والعين في الكلمة الأخيرة كلتاهما من وسط الحلق.',
        en: 'The ḥa in the first word and the ʿayn in the last word both come from the middle of the throat.',
      },
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'الغين في أول الكلمة الخامسة وفي الكلمة السادسة من أدنى الحلق، والعين في أول الكلمة الرابعة والسابعة من وسطه، والهمزة في أول الكلمة الثالثة من أقصاه.',
        en: 'The ghayn at the start of the fifth word and in the sixth word comes from the nearest part of the throat, the ʿayn at the start of the fourth and seventh words from its middle, and the hamzah at the start of the third word from its deepest part.',
      },
    },
    {
      verseKey: '114:4',
      note: {
        ar: 'الخاء في الكلمة الأخيرة من أدنى الحلق.',
        en: 'The kha in the last word comes from the nearest part of the throat.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 11,
        to: 12,
        note: {
          ar: 'مخارج الحلق الثلاثة: لأقصاه الهمزة والهاء، ولوسطه العين والحاء، ولأدناه الغين والخاء. (وبقية البيت الثاني تبدأ باللسان، وتأتي في فصله.)',
          en: 'The three makharij of the throat: its deepest part for hamzah and ha, its middle for ʿayn and ḥa, and its nearest part for ghayn and kha. (The rest of the second line starts on the tongue and comes again in its chapter.)',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: {
        ar: 'أي حرفين يخرجان من أقصى الحلق؟',
        en: 'Which two letters come from the deepest part of the throat?',
      },
      options: [
        { ar: 'ع ح', en: 'ع ح' },
        { ar: 'غ خ', en: 'غ خ' },
        { ar: 'ء ه', en: 'ء ه' },
        { ar: 'ق ك', en: 'ق ك' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'الهمزة والهاء من أقصى الحلق، والعين والحاء من وسطه، والغين والخاء من أدناه.',
        en: 'Hamzah and ha come from the deepest part, ʿayn and ḥa from the middle, and ghayn and kha from the nearest part.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'من أي مخرج تخرج العين والحاء؟', en: 'Which point do ʿayn and ḥa come from?' },
      options: [
        { ar: 'أقصى الحلق', en: 'The deepest part of the throat' },
        { ar: 'وسط الحلق', en: 'The middle of the throat' },
        { ar: 'أدنى الحلق', en: 'The nearest part of the throat' },
        { ar: 'أقصى اللسان', en: 'The back of the tongue' },
      ],
      correctIndex: 1,
      explanation: { ar: 'العين والحاء من وسط الحلق.', en: 'ʿAyn and ḥa come from the middle of the throat.' },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي حرفين يخرجان من أدنى الحلق (أقربه إلى الفم)؟',
        en: 'Which two letters come from the nearest part of the throat, closest to the mouth?',
      },
      options: [
        { ar: 'ء ه', en: 'ء ه' },
        { ar: 'غ خ', en: 'غ خ' },
        { ar: 'ع ح', en: 'ع ح' },
        { ar: 'ك ق', en: 'ك ق' },
      ],
      correctIndex: 1,
      explanation: { ar: 'الغين والخاء من أدنى الحلق.', en: 'Ghayn and kha come from the nearest part of the throat.' },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'الهاء والحاء: هل يخرجان من مخرج واحد؟',
        en: 'Do ha (ه) and ḥa (ح) come from the same point?',
      },
      options: [
        { ar: 'نعم، كلاهما من وسط الحلق', en: 'Yes, both from the middle of the throat' },
        { ar: 'لا: الهاء من أقصى الحلق، والحاء من وسطه', en: 'No: ha from the deepest part of the throat, ḥa from its middle' },
        { ar: 'لا: الهاء من الشفتين، والحاء من الحلق', en: 'No: ha from the lips, ḥa from the throat' },
        { ar: 'نعم، كلاهما من الجوف', en: 'Yes, both from the jawf' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الهاء من أقصى الحلق مع الهمزة، والحاء من وسطه مع العين.',
        en: 'Ha comes from the deepest part, with hamzah; ḥa from the middle, with ʿayn.',
      },
    },
  ],
  reviewed: false,
}
