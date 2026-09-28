import type { Lesson } from './types'

export const makharijShafatan: Lesson = {
  id: 'makharij-shafatan',
  order: 2.4,
  unit: 'makharij',
  title: { ar: 'مخارج الحروف: الشفتان', en: 'Makharij: ash-shafatan (the lips)' },
  summary: {
    ar: 'في الشفتين مخرجان لأربعة حروف: الفاء، ثم الباء والميم والواو.',
    en: 'The lips have two makharij for four letters: fa, then ba, meem and waw.',
  },
  sections: [
    {
      body: {
        ar: 'في الشفتين مخرجان لأربعة حروف تسمّى الحروف الشفوية.',
        en: 'The lips have two makharij, for four letters called the lip letters.',
      },
    },
    {
      heading: { ar: '١. بطن الشفة السفلى: ف', en: '1. The inside of the lower lip: fa' },
      body: {
        ar: 'الفاء من بطن الشفة السفلى مع أطراف الثنايا العليا.',
        en: 'Fa comes from the inside of the lower lip against the tips of the upper front teeth.',
      },
    },
    {
      heading: { ar: '٢. بين الشفتين: ب، م، و', en: '2. Both lips: ba, meem, waw' },
      body: {
        ar: 'الباء والميم والواو غير المدية من بين الشفتين: تنطبق الشفتان في الباء والميم، وتنضمّان دون انطباق في الواو. والميم تصحبها غنة من الخيشوم، وهو الفصل التالي.',
        en: 'Ba, meem and a waw that is not a madd letter come from both lips: the lips close for ba and meem, and round without closing for waw. Meem also carries a ghunnah from the khayshum, the next chapter.',
      },
    },
  ],
  animation: 'makharij-shafatan',
  // No rule is colored here: the notes point at the lip letters and where they come from.
  focusRules: [],
  examples: [
    {
      verseKey: '108:2',
      note: {
        ar: 'الفاء في أول الآية من بطن الشفة السفلى مع أطراف الثنايا العليا، والباء في الكلمة الثانية من بين الشفتين بانطباقهما، والواو في أول الكلمة الأخيرة من بين الشفتين بانضمامهما.',
        en: 'The fa at the start of the ayah comes from the inside of the lower lip against the upper front teeth; the ba in the second word from both lips, closed; and the waw at the start of the last word from both lips, rounded.',
      },
    },
    {
      verseKey: '1:2',
      note: {
        ar: 'الميم في الكلمة الأولى والباء المشددة في الكلمة الثالثة كلتاهما من بين الشفتين بانطباقهما.',
        en: 'The meem in the first word and the ba with shaddah in the third word both come from both lips, closed.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 18,
        to: 19,
        note: {
          ar: 'من آخر البيت الثامن عشر: الفاء من بطن الشفة مع أطراف الثنايا العليا، ثم الواو والباء والميم للشفتين. (وأول البيت الثامن عشر في فصل اللسان، وآخر التاسع عشر في فصل الخيشوم.)',
          en: 'From the end of line 18: fa from the inside of the lip with the edges of the upper front teeth, then waw, ba and meem from both lips. (The start of line 18 belongs to the tongue chapter, and the end of line 19 to the khayshum chapter.)',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'من أي مخرج تخرج الفاء؟', en: 'Which point does fa come from?' },
      options: [
        { ar: 'بين الشفتين', en: 'Both lips' },
        { ar: 'بطن الشفة السفلى مع أطراف الثنايا العليا', en: 'The inside of the lower lip with the tips of the upper front teeth' },
        { ar: 'طرف اللسان مع أطراف الثنايا العليا', en: 'The tip of the tongue with the edges of the upper front teeth' },
        { ar: 'الخيشوم', en: 'The khayshum' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الفاء من بطن الشفة السفلى مع أطراف الثنايا العليا.',
        en: 'Fa comes from the inside of the lower lip against the tips of the upper front teeth.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي الحروف تخرج من بين الشفتين؟', en: 'Which letters come from both lips?' },
      options: [
        { ar: 'ف و', en: 'ف و' },
        { ar: 'ب م و', en: 'ب م و' },
        { ar: 'ن م', en: 'ن م' },
        { ar: 'ث ذ ظ', en: 'ث ذ ظ' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الباء والميم والواو غير المدية من بين الشفتين.',
        en: 'Ba, meem and a waw that is not a madd letter come from both lips.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'في أي حرف تنضم الشفتان دون أن تنطبقا؟',
        en: 'For which letter do the lips round without closing?',
      },
      options: [
        { ar: 'الباء', en: 'Ba' },
        { ar: 'الميم', en: 'Meem' },
        { ar: 'الواو', en: 'Waw' },
        { ar: 'الفاء', en: 'Fa' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'تنطبق الشفتان في الباء والميم، وتنضمّان دون انطباق في الواو.',
        en: 'The lips close for ba and meem, and round without closing for waw.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم مخرجًا في الشفتين؟', en: 'How many makharij are at the lips?' },
      options: [
        { ar: 'واحد', en: 'One' },
        { ar: 'اثنان', en: 'Two' },
        { ar: 'ثلاثة', en: 'Three' },
        { ar: 'أربعة', en: 'Four' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'مخرجان: بطن الشفة السفلى للفاء، وبين الشفتين للباء والميم والواو.',
        en: 'Two: the inside of the lower lip for fa, and both lips for ba, meem and waw.',
      },
    },
  ],
  reviewed: false,
}
