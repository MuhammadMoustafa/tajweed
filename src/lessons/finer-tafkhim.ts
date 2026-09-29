import type { Lesson } from './types'

export const tafkhimLevels: Lesson = {
  id: 'tafkhim-levels',
  order: 12,
  unit: 'finer-levels',
  title: { ar: 'مراتب التفخيم', en: 'The levels of tafkhim' },
  summary: {
    ar: 'التفخيم ليس بدرجة واحدة: يقوى ويضعف بحسب حركة الحرف المفخَّم، وحروف الإطباق أمكن من غيرها.',
    en: 'Tafkhim is not one strength: it grows and fades with the vowel on the heavy letter, and the itbaq letters are fuller than the rest.',
  },
  sections: [
    {
      body: {
        ar: 'في درس «التفخيم والترقيق» عرفتَ أن حروف الاستعلاء السبعة (خ ص ض غ ط ق ظ) مفخَّمة دائمًا. هنا نفصّل: يقسم العلماء التفخيم خمس مراتب بحسب حركة الحرف، من الأقوى إلى الأضعف. اضغط زر التشغيل لترى المراتب واحدة بعد أخرى.',
        en: 'In the lesson "Heavy and light letters (tafkhim and tarqiq)" you learned that the seven letters of istiʿla (خ ص ض غ ط ق ظ) are always heavy. Here we add detail: scholars divide tafkhim into five levels by the vowel on the letter, from strongest to weakest. Press play to see the levels one after another.',
      },
      animation: 'tafkhim-levels',
    },
    {
      heading: { ar: 'المراتب الخمس', en: 'The five levels' },
      body: {
        ar: 'الأولى: الحرف المفتوح وبعده ألف. الثانية: المفتوح. الثالثة: المضموم. الرابعة: الساكن. الخامسة: المكسور. وكلها تفخيم؛ الفرق في مقدار امتلاء الفم بالصوت لا في وجود التفخيم.',
        en: 'First: a heavy letter with a fatha and an alif after it. Second: a fatha. Third: a damma. Fourth: a sukun. Fifth: a kasra. All five are tafkhim; the difference is how full the sound is, not whether it is heavy.',
      },
    },
    {
      heading: { ar: 'أين حروف الإطباق؟', en: 'Where the itbaq letters sit' },
      body: {
        ar: 'حروف الإطباق أربعة: ص ض ط ظ، وفيها ينطبق اللسان على الحنك. فإذا اجتمع حرف إطباق وحرف استعلاء غير مطبَق (خ غ ق) في المرتبة نفسها كان حرف الإطباق أمكن تفخيمًا. فالصاد المفتوحة وبعدها ألف أعلى ما يكون، والقاف المكسورة أدنى ما يكون.',
        en: 'The itbaq letters are four: ص ض ط ظ, where the tongue closes against the palate. When an itbaq letter and a non-itbaq heavy letter (خ غ ق) are on the same level, the itbaq letter is fuller. So a ṣad with a fatha and an alif after it is the fullest, and a qaf with a kasra the lightest.',
      },
    },
    {
      heading: { ar: 'المكسور يبقى مفخَّمًا', en: 'A kasra is still tafkhim' },
      body: {
        ar: 'قد يظن المبتدئ أن الحرف المفخَّم إذا كُسر صار مرقَّقًا. والصحيح أن أقصى اللسان يبقى مرتفعًا، فالتفخيم باقٍ وإن ضعف. لا ترقِّق الصاد والضاد والطاء والظاء والقاف والخاء والغين لأنها مكسورة.',
        en: 'A beginner may think a heavy letter turns light once it takes a kasra. It does not: the back of the tongue stays raised, so the tafkhim stays, only weaker. Never make ṣad, ḍad, ṭa, ẓa, qaf, kha or ghayn light because of a kasra.',
      },
    },
    {
      heading: { ar: 'ما لا يتغير', en: 'What does not change' },
      body: {
        ar: 'هذه المراتب في حروف الاستعلاء السبعة. أما الراء واللام في اسم الله والألف فلها أحكام أخرى مرّت في دروسها.',
        en: 'These levels belong to the seven istiʿla letters. Ra, the lam in the name of Allah and alif follow other rules, taught in their own lessons.',
      },
    },
  ],
  focusRules: ['tafkheem'],
  examples: [
    {
      verseKey: '101:1',
      note: {
        ar: 'القاف في أول الآية: مفتوحة وبعدها ألف، وهي المرتبة الأولى.',
        en: 'The qaf at the start of the ayah has a fatha with an alif after it: level one.',
      },
      marks: [{ word: 1, letter: 3, rule: 'tafkheem' }],
    },
    {
      verseKey: '1:6',
      note: {
        ar: 'في الكلمة الثانية حرفان مفخَّمان من حروف الإطباق: الطاء في آخرها مفتوحة (المرتبة الثانية)، والصاد مكسورة (المرتبة الخامسة) وتبقى مفخَّمة.',
        en: 'The second word has two itbaq letters: the ṭa at its end has a fatha (level two), and the ṣad has a kasra (level five) and stays heavy.',
      },
      marks: [
        { word: 2, letter: 3, rule: 'tafkheem' },
        { word: 2, letter: 6, rule: 'tafkheem' },
      ],
    },
    {
      verseKey: '112:1',
      note: {
        ar: 'القاف في أول الآية مضمومة: المرتبة الثالثة.',
        en: 'The qaf at the start of the ayah has a damma: level three.',
      },
      marks: [{ word: 1, letter: 1, rule: 'tafkheem' }],
    },
    {
      verseKey: '105:2',
      note: {
        ar: 'الضاد في الكلمة الخامسة ساكنة: المرتبة الرابعة.',
        en: 'The ḍad in the fifth word has a sukun: level four.',
      },
      marks: [{ word: 5, letter: 2, rule: 'tafkheem' }],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 22,
        note: {
          ar: 'عجز البيت يحصر حروف الاستعلاء السبعة في «خُصَّ ضَغْطٍ قِظْ».',
          en: 'The second half of the line limits the seven letters of istiʿla to "khuṣṣa ḍaghṭin qiẓ".',
        },
      },
      {
        from: 23,
        note: {
          ar: 'صدر البيت يسمّي حروف الإطباق الأربعة: الصاد والضاد والطاء والظاء.',
          en: 'The first half of the line names the four itbaq letters: ṣad, ḍad, ṭa and ẓa.',
        },
      },
      {
        from: 34,
        note: {
          ar: 'ترقيق الحروف المستفلة، والتحذير من تفخيم الألف: التفخيم لا يتعدى حروفه.',
          en: 'Make the low letters thin and beware of making the alif heavy: tafkhim stays with its own letters.',
        },
      },
      {
        from: 45,
        note: {
          ar: 'فخِّم حروف الاستعلاء، وزد حروف الإطباق تفخيمًا لأنها أقوى: هذا أصل تقديم الإطباق في المراتب.',
          en: 'Make the istiʿla letters heavy and give the itbaq letters more, since they are stronger: the root of ranking the itbaq letters higher.',
        },
      },
      {
        from: 46,
        note: {
          ar: 'إبانة الإطباق في الكلمتين اللتين يذكرهما البيت، والتاء بعد الطاء: يبقى الإطباق ولا يضيع عند التاء بعده.',
          en: 'Keep the itbaq clear in the two words the line names, where a ta follows the ṭa: the itbaq must not be lost.',
        },
      },
      {
        from: 48,
        note: {
          ar: 'خلِّص الحرف المنفتح من أثر الإطباق المجاور له حتى لا يُشبَّه بغيره.',
          en: 'Free a light (open) letter from the itbaq beside it, so the two are not confused.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'كم مرتبة للتفخيم بحسب الحركة؟', en: 'How many levels of tafkhim are there by the vowel?' },
      options: [
        { ar: 'ثلاث', en: 'Three' },
        { ar: 'خمس', en: 'Five' },
        { ar: 'سبع', en: 'Seven' },
        { ar: 'مرتبة واحدة', en: 'One' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'خمس: فتحة بعدها ألف، ثم فتحة، ثم ضمة، ثم سكون، ثم كسرة.',
        en: 'Five: fatha with an alif, fatha, damma, sukun, kasra.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي حالة أقوى تفخيمًا؟', en: 'Which state gives the strongest tafkhim?' },
      options: [
        { ar: 'الحرف المفخَّم المفتوح وبعده ألف', en: 'A heavy letter with a fatha and an alif after it' },
        { ar: 'الحرف المفخَّم المضموم', en: 'A heavy letter with a damma' },
        { ar: 'الحرف المفخَّم المكسور', en: 'A heavy letter with a kasra' },
        { ar: 'الحرف المفخَّم الساكن', en: 'A heavy letter with a sukun' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'المفتوح وبعده ألف هو أعلى المراتب.',
        en: 'A fatha followed by an alif is the top level.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يحدث للحرف المفخَّم إذا كُسر؟', en: 'What happens to a heavy letter that takes a kasra?' },
      options: [
        { ar: 'يبقى مفخَّمًا لكنه أضعف', en: 'It stays heavy, but weaker' },
        { ar: 'يصير مرقَّقًا', en: 'It becomes light' },
        { ar: 'يسقط', en: 'It drops out' },
        { ar: 'يصير غنة', en: 'It becomes a ghunnah' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'المكسور هو المرتبة الخامسة، وهي تفخيم ضعيف لا ترقيق.',
        en: 'A kasra is level five: weak tafkhim, not tarqiq.',
      },
    },
  ],
  reviewed: false,
}
