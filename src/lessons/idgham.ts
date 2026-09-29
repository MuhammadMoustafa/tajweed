import type { Lesson } from './types'

export const idgham: Lesson = {
  id: 'idgham',
  order: 3.1,
  unit: 'noon-sakinah',
  title: { ar: 'الإدغام', en: 'Idgham (merging)' },
  summary: {
    ar: 'تدخل النون الساكنة أو التنوين في الحرف الذي بعدهما، فيُنطق حرفًا واحدًا مشدّدًا.',
    en: 'A noon sakinah or tanween slips into the next letter, and the two are said as one doubled letter.',
  },
  sections: [
    {
      body: {
        ar: 'الإدغام: أن تدخل النون الساكنة أو التنوين في الحرف الذي بعدهما، فيُنطق الحرفان حرفًا واحدًا مشدَّدًا. حروفه ستة، يجمعها قولك: «يَرْمُلُون» — ي ر م ل و ن.',
        en: 'Idgham means the noon sakinah or tanween enters the letter after it, so the two are said as one letter with a shadda. It has six letters, ي ر م ل و ن, gathered in the phrase "يَرْمُلُون" (yarmulun), and it comes in two kinds.',
      },
    },
    {
      heading: { ar: 'شرط الإدغام', en: 'The condition' },
      body: {
        ar: 'يقع الإدغام إذا جاءت النون الساكنة أو التنوين في آخر كلمة، وجاء حرف الإدغام في أول الكلمة التي بعدها. أما إذا اجتمعا في كلمة واحدة فلا إدغام، بل تُظهَر النون؛ وذلك في كلمات قليلة جدًا في القرآن، يُنبَّه إليها في كتب التجويد.',
        en: 'Idgham happens when the noon sakinah or tanween ends one word and the idgham letter begins the next word. When both are inside a single word there is no idgham and the noon is pronounced clearly; this occurs in only a very few words of the Quran, which the tajweed books point out.',
      },
    },
    {
      heading: { ar: 'إدغام بغنّة: ي ن م و', en: 'With ghunnah: ي ن م و' },
      body: {
        ar: 'إذا جاء بعد النون الساكنة أو التنوين أحد حروف «ينمو» (ي ن م و) دخلت النون في الحرف وبقيت الغنّة، وهي صوت الخيشوم، مقدار حركتين. تُلوَّن بالأخضر كالغنّة.',
        en: 'When a noon sakinah or tanween is followed by one of the letters of "ينمو" (ي ن م و), the noon enters that letter but the ghunnah, the nasal hum, stays for about two counts. It is colored green, like every ghunnah.',
      },
      animation: 'idgham-ghunnah',
    },
    {
      heading: { ar: 'إدغام بلا غنّة: ل ر', en: 'Without ghunnah: ل ر' },
      body: {
        ar: 'إذا جاء بعد النون الساكنة أو التنوين لامٌ أو راءٌ دخلت النون فيه كاملًا بلا غنّة: يختفي صوت النون تمامًا، ويُنطق اللام أو الراء مشدَّدًا مباشرة. تُلوَّن بالرمادي، فالنون هنا لا تُنطق.',
        en: 'When a noon sakinah or tanween is followed by lam or ra, the noon enters it completely with no ghunnah: the sound of the noon disappears, and the lam or ra is said at once with a shadda. It is colored gray, because the noon is not pronounced here.',
      },
      animation: 'idgham-wo-ghunnah',
    },
  ],
  focusRules: ['idgham_ghunnah', 'idgham_wo_ghunnah'],
  examples: [
    {
      verseKey: '99:7',
      note: {
        ar: 'إدغام بغنّة في موضعين: نون ساكنة ثم ياء، وتنوين ثم ياء.',
        en: 'Idgham with ghunnah in two places: a noon sakinah then ya, and a tanween then ya.',
      },
    },
    {
      verseKey: '104:2',
      note: {
        ar: 'إدغام بغنّة بعد تنوين: التنوين في آخر الكلمة الثالثة والحرف بعده في أول الكلمة التالية.',
        en: 'Idgham with ghunnah after tanween: the tanween ends the third word and the letter after it begins the next.',
      },
    },
    {
      verseKey: '100:11',
      note: {
        ar: 'إدغام بلا غنّة: تنوين في آخر الكلمة الرابعة يدخل في اللام في أول الكلمة الخامسة.',
        en: 'Idgham without ghunnah: the tanween ending the fourth word enters the lam that begins the fifth.',
      },
    },
    {
      verseKey: '81:25',
      note: {
        ar: 'إدغام بلا غنّة في الراء بعد تنوين، عند نهاية الكلمة الرابعة.',
        en: 'Idgham without ghunnah into ra after a tanween, at the end of the fourth word.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 9,
        to: 12,
        note: {
          ar: 'يسمّي الإدغام حكمًا ثانيًا، وحروفه ستة في «يرملون»، ويقسمه قسمين: بغنّة في «ينمو»، وبغير غنّة في اللام والراء. وينبّه على أنه لا إدغام إذا كانا في كلمة واحدة.',
          en: 'It names idgham the second ruling, with its six letters in "yarmulun", and splits it in two: with ghunnah in "yanmu", without ghunnah in lam and ra. It also warns there is no idgham when both are in one word.',
        },
      },
    ],
    jazariyya: [
      {
        from: 66,
        to: 67,
        note: {
          ar: 'يذكر الإدغام في اللام والراء بلا غنّة، ثم الإدغام بغنّة في حروف «يُومِنُ»، ويستثني ما كان في كلمة واحدة.',
          en: 'It states idgham into lam and ra without ghunnah, then idgham with ghunnah in the letters of "yu\u2019minu", excepting what is inside a single word.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحروف التي فيها إدغام بغنّة في هذه الآية.',
        en: 'Tap the letters in this ayah that have idgham with ghunnah.',
      },
      verseKey: '99:7',
      rule: 'idgham_ghunnah',
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما حروف الإدغام بغنّة؟', en: 'Which letters give idgham with ghunnah?' },
      options: [
        { ar: 'ي ن م و', en: 'ي ن م و' },
        { ar: 'ل ر', en: 'ل ر' },
        { ar: 'ء ه ع ح غ خ', en: 'ء ه ع ح غ خ' },
        { ar: 'ب', en: 'ب' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'حروف «ينمو» تُدغَم فيها النون بغنّة، أما اللام والراء فبلا غنّة.',
        en: 'Noon merges into the letters of "ينمو" with ghunnah; lam and ra take it without.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي حرفين يُدغَم فيهما بلا غنّة؟',
        en: 'Which letters take idgham without ghunnah?',
      },
      options: [
        { ar: 'ي و', en: 'ي و' },
        { ar: 'م ن', en: 'م ن' },
        { ar: 'ل ر', en: 'ل ر' },
        { ar: 'ق ك', en: 'ق ك' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'اللام والراء فقط، وفيهما يختفي صوت النون تمامًا.',
        en: 'Only lam and ra; the sound of the noon disappears completely.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'متى يقع الإدغام؟',
        en: 'When does idgham happen?',
      },
      options: [
        {
          ar: 'النون الساكنة أو التنوين في آخر كلمة وحرف الإدغام في أول التي بعدها',
          en: 'The noon sakinah or tanween ends one word and the idgham letter begins the next',
        },
        { ar: 'دائمًا داخل الكلمة الواحدة', en: 'Always inside a single word' },
        { ar: 'عند حروف الحلق', en: 'Before the throat letters' },
        { ar: 'عند الباء', en: 'Before ba' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'إذا كان الحرفان في كلمة واحدة فلا إدغام، بل تُظهَر النون.',
        en: 'When both are in one word there is no idgham; the noon is pronounced clearly.',
      },
    },
  ],
  reviewed: false,
}
