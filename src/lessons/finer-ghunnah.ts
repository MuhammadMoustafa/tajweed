import type { Lesson } from './types'

export const ghunnahLevels: Lesson = {
  id: 'ghunnah-levels',
  order: 12.1,
  unit: 'finer-levels',
  title: { ar: 'مراتب الغنة', en: 'The levels of ghunnah' },
  summary: {
    ar: 'الغنة في أحكام النون والميم ليست بقوة واحدة: أقواها في المشددتين، وأضعفها في الإظهار.',
    en: 'The ghunnah is not equally strong in every rule of noon and meem: strongest on the doubled letters, lightest in izhar.',
  },
  sections: [
    {
      body: {
        ar: 'تعلمتَ في درس «الغنة في النون والميم المشددتين» أن الغنة حركتان، وفي دروس الإدغام والإخفاء والإقلاب والإظهار أن للنون الساكنة والتنوين أحكامًا. هنا نرتّب هذه الأحكام بحسب قوة الغنة فيها، كما يُدرَّس عادةً. اضغط زر التشغيل لترى المراتب.',
        en: 'In the lesson "Ghunnah on noon and meem with a shaddah" you learned a ghunnah of two counts, and in the lessons on idgham, ikhfa, iqlab and izhar that noon sakinah and tanween have rulings. Here we order those rulings by how strong the ghunnah is in each, as it is commonly taught. Press play to see the levels.',
      },
      animation: 'ghunnah-levels',
    },
    {
      heading: { ar: 'المراتب من الأقوى إلى الأضعف', en: 'The levels, strongest first' },
      body: {
        ar: 'الأولى: النون والميم المشددتان. الثانية: الإدغام بغنة (في ي ن م و). الثالثة: الإخفاء والإقلاب. الرابعة: الإظهار. والترتيب بين الإدغام والإخفاء يختلف قليلًا بين العلماء، والمهم أن تعرف أن أقوى الغنة في المشددتين وأضعفها في الإظهار.',
        en: 'First: doubled noon and meem. Second: idgham with ghunnah (into ي ن م و). Third: ikhfa and iqlab. Fourth: izhar. Scholars differ a little on the order between idgham and ikhfa; what matters is that the ghunnah is strongest on the doubled letters and lightest in izhar.',
      },
    },
    {
      heading: { ar: 'كم مقدار الغنة؟', en: 'How long is each?' },
      body: {
        ar: 'في رواية حفص: الغنة في المشددتين وفي الإدغام بغنة حركتان. وفي الإخفاء والإقلاب نحو حركتين كذلك، لكنها أخف. أما في الإظهار فلا تُمَدّ الغنة؛ تبقى صفة طبيعية في النون والميم. وحركتان هنا هما مقدار حركتي المد الطبيعي نفسهما.',
        en: 'In Hafs the ghunnah on doubled letters and in idgham with ghunnah is two counts. In ikhfa and iqlab it is also about two counts, but lighter. In izhar the ghunnah is not stretched; it stays only as the natural quality of noon and meem. Two counts here is the same length as two counts of a natural madd.',
      },
    },
    {
      heading: { ar: 'الإظهار: لا مدّ', en: 'Izhar: no stretching' },
      body: {
        ar: 'لا تحذف الغنة في الإظهار، ولا تطل فيها: تُنطق النون بوضوح من مخرجها ثم ينتقل اللسان إلى الحرف الحلقي بعدها.',
        en: 'Do not drop the ghunnah in izhar, and do not stretch it: the noon is pronounced clearly from its own place, then the tongue moves on to the throat letter after it.',
      },
    },
  ],
  focusRules: ['ghunnah', 'idgham_ghunnah', 'ikhafa', 'iqlab', 'izhar'],
  examples: [
    {
      verseKey: '78:1',
      note: {
        ar: 'المرتبة الأولى: الميم المشددة في الكلمة الأولى.',
        en: 'Level one: the meem with a shaddah in the first word.',
      },
    },
    {
      verseKey: '99:7',
      note: {
        ar: 'المرتبة الثانية: إدغام بغنة، نون ثم ياء وتنوين ثم ياء.',
        en: 'Level two: idgham with ghunnah, a noon then ya and a tanween then ya.',
      },
    },
    {
      verseKey: '113:2',
      note: {
        ar: 'المرتبة الثالثة: إخفاء، نون ساكنة في آخر كلمة قبل حرف الإخفاء.',
        en: 'Level three: ikhfa, a noon sakinah at the end of a word before an ikhfa letter.',
      },
    },
    {
      verseKey: '80:27',
      note: {
        ar: 'المرتبة الثالثة أيضًا: إقلاب، نون ساكنة وباء في كلمة واحدة.',
        en: 'Also level three: iqlab, a noon sakinah and a ba in one word.',
      },
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'المرتبة الرابعة: إظهار، نون ساكنة وبعدها حرف حلقي في الكلمة الثالثة.',
        en: 'Level four: izhar, a noon sakinah followed by a throat letter in the third word.',
      },
      marks: [
        { word: 3, letter: 2, rule: 'izhar' },
        { word: 3, letter: 3, rule: 'izhar' },
      ],
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 7,
        to: 8,
        note: {
          ar: 'الإظهار قبل حروف الحلق الستة: أضعف مراتب الغنة.',
          en: 'Izhar before the six throat letters: the lightest level of ghunnah.',
        },
      },
      {
        from: 9,
        to: 11,
        note: {
          ar: 'الإدغام بستة حروف، وقسم منه بغنة (ي ن م و) إلا إذا كان النون وحرف الإدغام في كلمة واحدة فلا إدغام.',
          en: 'Idgham with six letters, one part of it with ghunnah (ي ن م و), except when the noon and the letter are in one word, where there is no idgham.',
        },
      },
      {
        from: 13,
        note: {
          ar: 'الإقلاب عند الباء: ميم بغنة مع الإخفاء.',
          en: 'Iqlab at ba: a meem with ghunnah and hiding.',
        },
      },
      {
        from: 14,
        to: 16,
        note: {
          ar: 'الإخفاء عند خمسة عشر حرفًا، وهي مذكورة في البيت الأخير من هذا المقطع.',
          en: 'Ikhfa at fifteen letters, gathered in the last line of this passage.',
        },
      },
      {
        from: 17,
        note: {
          ar: 'الأمر بالغنة على الميم والنون المشددتين وتسمية كل منهما حرف غنة: أقوى المراتب.',
          en: 'The command to sound the ghunnah on doubled meem and noon, each called a ghunnah letter: the strongest level.',
        },
      },
    ],
    jazariyya: [
      {
        from: 62,
        note: {
          ar: 'صدر البيت: أظهر الغنة من النون والميم إذا شُدِّدتا.',
          en: 'The first half: show the ghunnah of noon and meem when they carry a shaddah.',
        },
      },
      {
        from: 65,
        to: 68,
        note: {
          ar: 'أحكام النون الساكنة والتنوين: الإظهار عند الحلق، والإدغام (بلا غنة في اللام والراء، وبغنة في الحروف الأربعة)، والقلب عند الباء بغنة، والإخفاء عند باقي الحروف.',
          en: 'The rulings of noon sakinah and tanween: izhar at the throat letters, idgham (without ghunnah into lam and ra, with ghunnah into the four letters), iqlab at ba with ghunnah, and ikhfa at the rest.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'أي حالة فيها أقوى غنة؟', en: 'Where is the ghunnah strongest?' },
      options: [
        { ar: 'النون والميم المشددتان', en: 'Doubled noon and meem' },
        { ar: 'الإظهار', en: 'Izhar' },
        { ar: 'الإخفاء', en: 'Ikhfa' },
        { ar: 'الإقلاب', en: 'Iqlab' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'المشددتان أقوى مراتب الغنة.',
        en: 'The doubled letters are the strongest level.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا نفعل بالغنة في الإظهار؟', en: 'What do we do with the ghunnah in izhar?' },
      options: [
        { ar: 'لا نمدّها ولا نحذفها', en: 'We neither stretch nor drop it' },
        { ar: 'نمدّها ست حركات', en: 'We stretch it six counts' },
        { ar: 'نحذفها كلها', en: 'We drop it completely' },
        { ar: 'نمدّها أربع حركات', en: 'We stretch it four counts' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'في الإظهار تبقى الغنة الطبيعية دون مدّ.',
        en: 'In izhar the natural ghunnah stays, unstretched.',
      },
    },
  ],
  reviewed: false,
}
