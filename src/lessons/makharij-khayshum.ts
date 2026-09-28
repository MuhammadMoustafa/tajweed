import type { Lesson } from './types'

export const makharijKhayshum: Lesson = {
  id: 'makharij-khayshum',
  order: 2.5,
  unit: 'makharij',
  title: { ar: 'مخارج الحروف: الخيشوم', en: 'Makharij: al-khayshum (the nose)' },
  summary: {
    ar: 'الخيشوم مخرج واحد، ومنه الغنة التي تصحب النون والميم.',
    en: 'The khayshum is one makhraj: the ghunnah that goes with noon and meem comes from it.',
  },
  sections: [
    {
      body: {
        ar: 'الخيشوم أعلى الأنف من الداخل. ومنه تخرج الغنة، وهي صوت رخيم يصحب النون والميم دائمًا، وأظهر ما تكون فيهما إذا شُدِّدتا.',
        en: 'The khayshum is the inner top of the nose. The ghunnah comes from it: a soft humming sound that always goes with noon and meem, clearest when they carry a shaddah.',
      },
    },
    {
      heading: { ar: 'جرّب بنفسك', en: 'Try it yourself' },
      body: {
        ar: 'أمسك أنفك وانطق نونًا مشدّدة أو ميمًا مشدّدة: ينحبس الصوت، لأن الغنة تمرّ من الخيشوم. ثم انطق حرفًا آخر كالباء: لا يتغير شيء.',
        en: "Hold your nose and say a noon or a meem with a shaddah: the sound is blocked, because the ghunnah passes through the khayshum. Then say another letter, like ba: nothing changes.",
      },
    },
    {
      heading: { ar: 'في الدروس القادمة', en: 'In the lessons ahead' },
      body: {
        ar: 'عند إخفاء النون الساكنة أو إدغامها بغنة، يكاد صوت النون يخرج كله من الخيشوم. وستأتي هذه الأحكام في دروس النون الساكنة والتنوين.',
        en: 'When a noon sakinah is hidden (ikhfa) or merged with a ghunnah, its sound comes almost entirely from the khayshum. These rules come in the lessons on noon sakinah and tanween.',
      },
    },
  ],
  animation: 'makharij-khayshum',
  // No rule is colored here: the notes point at the letters that carry the ghunnah.
  focusRules: [],
  examples: [
    {
      verseKey: '108:1',
      note: {
        ar: 'النون المشددة في الكلمة الأولى: غنتها من الخيشوم.',
        en: 'The noon with shaddah in the first word: its ghunnah comes from the khayshum.',
      },
    },
    {
      verseKey: '78:1',
      note: {
        ar: 'الميم المشددة في الكلمة الأولى: غنتها من الخيشوم.',
        en: 'The meem with shaddah in the first word: its ghunnah comes from the khayshum.',
      },
    },
    {
      verseKey: '114:6',
      note: {
        ar: 'النون المشددة في الكلمة الثانية وفي الكلمة الأخيرة: غنتهما من الخيشوم.',
        en: 'The noon with shaddah in the second word and in the last word: their ghunnah comes from the khayshum.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 19,
        note: {
          ar: 'آخر البيت: الغنة مخرجها الخيشوم. (وأوله في فصل الشفتين.)',
          en: 'The end of the line: the ghunnah comes from the khayshum. (Its start belongs to the lips chapter.)',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يخرج من الخيشوم؟', en: 'What comes from the khayshum (the nose)?' },
      options: [
        { ar: 'القلقلة', en: 'Qalqalah' },
        { ar: 'الغنة', en: 'Ghunnah' },
        { ar: 'المد', en: 'Madd' },
        { ar: 'الهمزة', en: 'Hamzah' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الغنة صوت يخرج من الخيشوم ويصاحب النون والميم.',
        en: 'Ghunnah is the humming sound from the nose that goes with noon and meem.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي حرفين تصحبهما الغنة؟', en: 'Which two letters carry the ghunnah?' },
      options: [
        { ar: 'الباء والفاء', en: 'Ba and fa' },
        { ar: 'اللام والراء', en: 'Lam and ra' },
        { ar: 'النون والميم', en: 'Noon and meem' },
        { ar: 'الواو والياء', en: 'Waw and ya' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'الغنة تصحب النون والميم، وأظهر ما تكون فيهما مشدّدتين.',
        en: 'The ghunnah goes with noon and meem, clearest when they carry a shaddah.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'إذا أمسكت أنفك ونطقت نونًا مشدّدة، ماذا يحدث؟',
        en: 'If you hold your nose and say a noon with a shaddah, what happens?',
      },
      options: [
        { ar: 'ينحبس الصوت', en: 'The sound is blocked' },
        { ar: 'يعلو الصوت', en: 'The sound gets louder' },
        { ar: 'يتحول إلى ميم', en: 'It turns into a meem' },
        { ar: 'لا يتغير شيء', en: 'Nothing changes' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'ينحبس الصوت لأن الغنة تمرّ من الخيشوم.',
        en: 'The sound is blocked, because the ghunnah passes through the khayshum.',
      },
    },
  ],
  reviewed: false,
}
