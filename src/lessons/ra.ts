import type { Lesson } from './types'

export const ra: Lesson = {
  id: 'ra',
  order: 12,
  title: { ar: 'أحكام الراء', en: 'Ra: heavy or light' },
  summary: {
    ar: 'الراء تُفخَّم مع الفتحة والضمة، وتُرقَّق مع الكسرة، والراء الساكنة يتبع حكمها ما قبلها.',
    en: 'Ra is heavy with fatha or damma and light with kasra; a ra with a sukun follows what comes before it.',
  },
  sections: [
    {
      body: {
        ar: 'الراء ليست من حروف الاستعلاء السبعة، فلا تُفخَّم دائمًا كالصاد والقاف، بل تتغير بحسب حركتها وما قبلها. فهي مفخَّمة في مواضع ومرقَّقة في مواضع. وقد تعلمنا في درس التفخيم والترقيق أن أقصى اللسان يرتفع في التفخيم ويبقى منخفضًا في الترقيق؛ وهذا هو الفرق نفسه هنا. وهذا الدرس على رواية حفص عن عاصم.',
        en: 'Ra is not one of the seven istiʿla letters, so it is not always heavy like ṣad or qaf. It changes with its own vowel and with what comes before it: heavy in some places, light in others. The lesson on heavy and light letters showed that the back of the tongue rises for a heavy letter and stays low for a light one; that is the same difference here. This lesson follows the riwayah of Hafs from ʿAsim.',
      },
    },
    {
      heading: { ar: 'الراء المتحركة', en: 'A ra with a vowel' },
      body: {
        ar: 'انظر إلى حركة الراء نفسها. إذا كانت الراء مفتوحة أو مضمومة فهي مفخَّمة، وإذا كانت مكسورة فهي مرقَّقة. وهذا أسهل أحوالها.',
        en: 'Look at the ra’s own vowel. A ra with fatha or with damma is heavy; a ra with kasra is light. This is the easiest case.',
      },
      animation: 'ra-vowel',
    },
    {
      heading: { ar: 'الراء الساكنة', en: 'A ra with a sukun' },
      body: {
        ar: 'الراء الساكنة تتبع الحركة التي قبلها. إذا سبقتها فتحة أو ضمة فُخِّمت. وإذا سبقتها كسرة أصلية في الكلمة نفسها رُقِّقت. ولها استثناءان تُفخَّم فيهما مع الكسرة: أن يأتي بعدها في الكلمة نفسها حرف من حروف الاستعلاء، أو أن تكون الكسرة قبلها كسرة همزة وصل، لأنها ليست أصلية في الكلمة.',
        en: 'A ra with a sukun follows the vowel before it. After a fatha or a damma it is heavy. After an original kasra in the same word it is light. It has two exceptions where it stays heavy despite the kasra: when a letter of istiʿla follows it in the same word, or when the kasra before it belongs to a hamzat wasl, since that kasra is not original to the word.',
      },
      animation: 'ra-sakinah',
    },
    {
      heading: { ar: 'الوقف على الراء', en: 'Stopping on a ra' },
      body: {
        ar: 'إذا وقفت على راء فإنها تسكن، ويُنظر إلى الحرف الذي قبلها. إن كان قبلها فتحة أو ضمة أو ألف أو واو ساكنة فُخِّمت. وإن كان قبلها كسرة أو ياء ساكنة رُقِّقت. وإن كان قبلها حرف ساكن غير الياء فانظر إلى ما قبله: كسرة فترقيق، وفتحة أو ضمة فتفخيم، وإن كان الساكن حرف استعلاء فتفخيم.',
        en: 'When you stop on a ra it takes a sukun, and you look at what is before it. After a fatha, a damma, an alif or a waw sakinah it is heavy. After a kasra or a ya sakinah it is light. If a sakin letter other than ya is before it, look at what is before that letter: a kasra means light, a fatha or damma means heavy, and if that sakin letter is a letter of istiʿla it is heavy.',
      },
      animation: 'ra-waqf',
    },
    {
      heading: { ar: 'مواضع فيها وجهان', en: 'Words that allow either way' },
      body: {
        ar: 'في القرآن كلمات قليلة تجوز فيها الراء بالتفخيم وبالترقيق، وهي مما يتعلمه الطالب من معلمه بعد أن يتقن القواعد السابقة. ونكتفي هنا بمعرفة أن هذه الحالات قليلة ومحدودة، وأن القاعدة العامة هي ما مرّ في هذا الدرس.',
        en: 'A few words in the Quran allow the ra to be said either heavy or light. A student learns them from a teacher once the rules above are solid. For now, know that these cases are few and limited, and that the general rule is the one in this lesson.',
      },
    },
  ],
  focusRules: ['tafkheem', 'tarqeeq'],
  examples: [
    {
      verseKey: '1:2',
      note: {
        ar: 'الراء في الكلمة الثالثة مفتوحة فهي مفخَّمة.',
        en: 'The ra in the third word has a fatha, so it is heavy.',
      },
      marks: [{ word: 3, letter: 1, rule: 'tafkheem' }],
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'الراء في الكلمة الأولى مفتوحة فمفخَّمة (وفي الكلمة نفسها صاد مفخَّمة أيضًا). والراء في الكلمة الخامسة مكسورة فمرقَّقة، ولا يغيّر ذلك الياء الساكنة قبلها.',
        en: 'The ra in the first word has a fatha, so it is heavy (the same word also has a heavy ṣad). The ra in the fifth word has a kasra, so it is light; the ya sakinah before it does not change that.',
      },
      marks: [
        { word: 1, letter: 2, rule: 'tafkheem' },
        { word: 5, letter: 3, rule: 'tarqeeq' },
      ],
    },
    {
      verseKey: '102:2',
      note: {
        ar: 'الراء في الكلمة الثانية ساكنة بعد ضمة، فهي مفخَّمة.',
        en: 'The ra in the second word has a sukun after a damma, so it is heavy.',
      },
      marks: [{ word: 2, letter: 2, rule: 'tafkheem' }],
    },
    {
      verseKey: '105:3',
      note: {
        ar: 'الراء في الكلمة الأولى ساكنة بعد فتحة، فهي مفخَّمة.',
        en: 'The ra in the first word has a sukun after a fatha, so it is heavy.',
      },
      marks: [{ word: 1, letter: 3, rule: 'tafkheem' }],
    },
    {
      verseKey: '110:3',
      note: {
        ar: 'الراء في الكلمة الرابعة ساكنة بعد كسرة أصلية، وحرف الاستعلاء الغين قبلها لا بعدها، فهي مرقَّقة. والراء في الكلمة الثالثة مفتوحة فمفخَّمة.',
        en: 'The ra in the fourth word has a sukun after an original kasra, and its istiʿla letter (ghayn) is before it, not after it, so it is light. The ra in the third word has a fatha, so it is heavy.',
      },
      marks: [
        { word: 3, letter: 1, rule: 'tafkheem' },
        { word: 4, letter: 7, rule: 'tarqeeq' },
      ],
    },
    {
      verseKey: '78:21',
      note: {
        ar: 'الراء في الكلمة الرابعة ساكنة بعد كسرة أصلية، لكن بعدها في الكلمة نفسها حرف استعلاء هو الصاد، فتبقى مفخَّمة.',
        en: 'The ra in the fourth word has a sukun after an original kasra, but a letter of istiʿla (the ṣad) follows it in the same word, so it stays heavy.',
      },
      marks: [{ word: 4, letter: 2, rule: 'tafkheem' }],
    },
    {
      verseKey: '89:28',
      note: {
        ar: 'الراء في الكلمة الأولى ساكنة بعد كسرة همزة وصل، وهي كسرة عارضة، فهي مفخَّمة.',
        en: 'The ra in the first word has a sukun after the kasra of a hamzat wasl, which is not original, so it is heavy.',
      },
      marks: [{ word: 1, letter: 2, rule: 'tafkheem' }],
    },
    {
      verseKey: '97:1',
      note: {
        ar: 'عند الوقف على آخر الآية تسكن الراء، وقبلها دال ساكنة قبلها فتحة، فهي مفخَّمة.',
        en: 'Stopping at the end of the ayah, the ra takes a sukun. A sakin dal is before it, with a fatha before that, so it is heavy.',
      },
      marks: [{ word: 5, letter: 5, rule: 'tafkheem' }],
    },
    {
      verseKey: '103:1',
      note: {
        ar: 'عند الوقف تسكن الراء، وقبلها صاد ساكنة وهي حرف استعلاء، فهي مفخَّمة.',
        en: 'Stopping here, the ra takes a sukun, and the sakin letter before it is ṣad, a letter of istiʿla, so it is heavy.',
      },
      marks: [{ word: 1, letter: 6, rule: 'tafkheem' }],
    },
    {
      verseKey: '100:11',
      note: {
        ar: 'عند الوقف على آخر الآية تسكن الراء ويسبقها ياء ساكنة، فهي مرقَّقة، مع أنها في الوصل مضمومة.',
        en: 'Stopping at the end of the ayah, the ra takes a sukun with a ya sakinah before it, so it is light, even though it carries a damma when you read on.',
      },
      marks: [{ word: 5, letter: 5, rule: 'tarqeeq' }],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 41,
        to: 43,
        note: {
          ar: 'باب الراءات: ترقيق الراء المكسورة، والساكنة بعد كسرة إلا إذا جاء بعدها حرف استعلاء أو كانت الكسرة غير أصلية، مع الإشارة إلى الوجهين في بعض المواضع.',
          en: 'The chapter on the ra: make a ra with kasra light, and a ra with a sukun after a kasra, unless an istiʿla letter follows or the kasra is not original; it also points to the words that allow either way.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ما حكم الراء المفتوحة؟', en: 'What is the rule for a ra with fatha?' },
      options: [
        { ar: 'تفخيم', en: 'Heavy' },
        { ar: 'ترقيق', en: 'Light' },
        { ar: 'تُحذف', en: 'It is dropped' },
        { ar: 'تُدغم', en: 'It merges into the next letter' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الراء المفتوحة أو المضمومة مفخَّمة، والمكسورة مرقَّقة.',
        en: 'A ra with fatha or damma is heavy; with kasra it is light.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'راء ساكنة قبلها كسرة أصلية في الكلمة نفسها، ولا حرف استعلاء بعدها. ما حكمها؟',
        en: 'A ra with a sukun follows an original kasra in the same word, with no istiʿla letter after it. What is it?',
      },
      options: [
        { ar: 'ترقيق', en: 'Light' },
        { ar: 'تفخيم', en: 'Heavy' },
        { ar: 'إخفاء', en: 'Hidden' },
        { ar: 'مدّ', en: 'A madd' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الراء الساكنة بعد كسرة أصلية مرقَّقة إلا إذا جاء بعدها حرف استعلاء.',
        en: 'A ra with a sukun after an original kasra is light unless an istiʿla letter follows it.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'وقفتَ على راء قبلها ياء ساكنة. ما حكمها؟',
        en: 'You stop on a ra with a ya sakinah before it. What is it?',
      },
      options: [
        { ar: 'ترقيق', en: 'Light' },
        { ar: 'تفخيم', en: 'Heavy' },
        { ar: 'لا يجوز الوقف', en: 'You may not stop there' },
        { ar: 'تُنطق ياء', en: 'It is said as a ya' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'عند الوقف تُرقَّق الراء إذا سبقتها ياء ساكنة أو كسرة.',
        en: 'When stopping, a ra is light after a ya sakinah or a kasra.',
      },
    },
  ],
  reviewed: false,
}
