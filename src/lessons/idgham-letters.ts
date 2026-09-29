import type { Lesson } from './types'

export const idghamLetters: Lesson = {
  id: 'idgham-letters',
  order: 5.1,
  unit: 'lam-merging',
  title: { ar: 'إدغام الحرفين: المثلان والمتجانسان والمتقاربان', en: 'Merging two letters: mithlayn, mutajanisayn, mutaqaribayn' },
  summary: {
    ar: 'حرف ساكن يلتقي بحرف متحرك يشبهه أو يقاربه في المخرج، فيدخل الأول في الثاني ويُنطق حرفًا واحدًا مشدَّدًا.',
    en: 'A letter with a sukun meets a letter with a vowel that is the same as it, or made at the same or a nearby place: the first goes into the second and one doubled letter is pronounced.',
  },
  sections: [
    {
      body: {
        ar: 'إذا التقى حرفان في كلمتين متجاورتين، وكان الأول ساكنًا والثاني متحركًا، فقد يُدغم الأول في الثاني: يُنطق حرفًا واحدًا مشدَّدًا. وتنقسم هذه الحروف بحسب العلاقة بينها في المخرج والصفات إلى ثلاثة أنواع. الحرف الأول هو الملوَّن في الأمثلة.',
        en: 'When two letters meet across two neighbouring words, the first with a sukun and the second with a vowel, the first may be merged into the second, so that one doubled letter is pronounced. By how the two relate in place and qualities, there are three kinds. The first letter is the colored one in the examples.',
      },
    },
    {
      heading: { ar: 'المثلان', en: 'Mithlayn (identical letters)' },
      body: {
        ar: 'المثلان: حرفان متفقان في المخرج والصفات، مثل باء وباء، وتاء وتاء، ولام ولام. إذا كان الأول ساكنًا والثاني متحركًا وجب الإدغام، ويسمى إدغامًا صغيرًا. ولا يُدغم إذا كان الأول حرف مد، كالواو أو الياء الساكنة بعد حركة تناسبها، فيُظهران. وإذا تحرك الحرفان معًا سمي كبيرًا، ولا إدغام فيه في رواية حفص إلا في مواضع خاصة.',
        en: 'Mithlayn are two letters that agree in place and in qualities, such as ba and ba, ta and ta, or lam and lam. When the first has a sukun and the second a vowel, they must be merged; this is the small (saghir) kind. They are not merged when the first is a madd letter, a waw or ya with a sukun after a matching vowel, which stays clear. When both letters carry vowels the kind is called large (kabir), and in Hafs it is not merged apart from a few special places.',
      },
      animation: 'idgham-mithlayn',
    },
    {
      heading: { ar: 'المتجانسان', en: 'Mutajanisayn (same place, different qualities)' },
      body: {
        ar: 'المتجانسان: حرفان يتفقان في المخرج ويختلفان في الصفة. ومن مواضعهما الشائعة: التاء والدال والطاء، والثاء والذال والظاء، والباء والميم. فإذا كان الأول ساكنًا والثاني متحركًا أُدغم الأول في الثاني، ويسمى إدغامًا صغيرًا.',
        en: 'Mutajanisayn are two letters that share a place but differ in qualities. The common sets are ta, dal and ṭa; tha, dhal and ẓa; and ba and meem. When the first has a sukun and the second a vowel, the first is merged into the second (the small kind).',
      },
      animation: 'idgham-mutajanisayn',
    },
    {
      heading: { ar: 'المتقاربان', en: 'Mutaqaribayn (nearby places)' },
      body: {
        ar: 'المتقاربان: حرفان متقاربان في المخرج، وقد يتفقان في الصفات أو يختلفان. وأشهر مواضعهما في رواية حفص: اللام إذا التقت بالراء، والقاف إذا التقت بالكاف. فإذا كان الأول ساكنًا والثاني متحركًا أُدغم الأول في الثاني.',
        en: 'Mutaqaribayn are two letters made at nearby places, whether or not their qualities agree. The best-known cases in Hafs are lam meeting ra, and qaf meeting kaf. When the first has a sukun and the second a vowel, the first is merged into the second.',
      },
      animation: 'idgham-mutaqaribayn',
    },
    {
      heading: { ar: 'ما يدلك في الأمثلة', en: 'What to look for in the examples' },
      body: {
        ar: 'في الأمثلة الأولى (المثلان) الحرف الملوَّن هو الأول الساكن. والقرآن يكتب الحرف الثاني مشدَّدًا حين يُدغم فيه ما قبله. وفي الأخيرين يظهر اللون نفسه على الحرف الأول.',
        en: 'In the first examples (mithlayn) the colored letter is the first one, with the sukun. In the Quran text the second letter carries a shaddah when the letter before it is merged into it. In the other two kinds the same color is on the first letter.',
      },
    },
  ],
  focusRules: ['idgham_mithlayn', 'idgham_mutajanisayn', 'idgham_mutaqaribayn'],
  examples: [
    {
      verseKey: '2:16',
      note: {
        ar: 'مثلان: التاء الأولى في الكلمة السابعة ساكنة، والثانية متحركة في بداية الكلمة الثامنة.',
        en: 'Mithlayn: the first ta, at the end of the seventh word, has a sukun; the second, at the start of the eighth word, carries a vowel.',
      },
      marks: [{ word: 7, letter: 4, rule: 'idgham_mithlayn' }],
    },
    {
      verseKey: '2:60',
      note: {
        ar: 'مثلان: الباء الأخيرة في الكلمة السابعة تدخل في الباء التي تبدأ بها الكلمة بعدها.',
        en: 'Mithlayn: the last ba of the seventh word goes into the ba that begins the word after it.',
      },
      marks: [{ word: 7, letter: 4, rule: 'idgham_mithlayn' }],
    },
    {
      verseKey: '27:28',
      note: {
        ar: 'مثلان: باء ساكنة في آخر الكلمة الأولى وباء متحركة بعدها.',
        en: 'Mithlayn: a ba with a sukun ends the first word, and a ba with a vowel follows it.',
      },
      marks: [{ word: 1, letter: 4, rule: 'idgham_mithlayn' }],
    },
    {
      verseKey: '109:4',
      note: {
        ar: 'متجانسان: الدال الملوَّنة في آخر الكلمة تدخل في التاء بعدها. وهما من مخرج واحد.',
        en: 'Mutajanisayn: the colored dal at the end of the word goes into the ta after it. They share one place.',
      },
    },
    {
      verseKey: '74:14',
      note: {
        ar: 'متجانسان: الدال والتاء مرة أخرى، داخل الكلمة نفسها هذه المرة.',
        en: 'Mutajanisayn: dal and ta again, this time inside the word itself.',
      },
    },
    {
      verseKey: '11:42',
      note: {
        ar: 'متجانسان: الباء والميم من الشفتين، فتُدغم الباء في الميم.',
        en: 'Mutajanisayn: ba and meem both come from the lips, so the ba is merged into the meem.',
      },
    },
    {
      verseKey: '23:93',
      note: {
        ar: 'متقاربان: اللام الملوَّنة تدخل في الراء بعدها.',
        en: 'Mutaqaribayn: the colored lam goes into the ra after it.',
      },
    },
    {
      verseKey: '77:20',
      note: {
        ar: 'متقاربان: القاف الملوَّنة تدخل في الكاف، وهما من أقصى اللسان.',
        en: 'Mutaqaribayn: the colored qaf goes into the kaf; both come from the back of the tongue.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 30,
        to: 32,
        note: {
          ar: 'تعريف الأنواع الثلاثة: المثلان متفقان في المخرج والصفات، والمتقاربان متقاربان في المخرج، والمتجانسان متفقان في المخرج ومختلفان في الصفات.',
          en: 'Defines the three kinds: mithlayn agree in place and qualities, mutaqaribayn are close in place, and mutajanisayn share a place but differ in qualities.',
        },
      },
      {
        from: 33,
        to: 34,
        note: {
          ar: 'إن سكن الأول فهو الصغير، وإن تحرك الحرفان فهو الكبير.',
          en: 'If the first letter has a sukun it is the small kind; if both letters carry vowels, the large kind.',
        },
      },
    ],
    jazariyya: [
      {
        from: 50,
        to: 51,
        note: {
          ar: 'يأمر بإدغام المثلين والمتجانسين إذا سكن الأول، ثم يذكر مواضع يُظهَر فيها الحرف، منها ما يأتي بعد حرف مد.',
          en: 'Says to merge mithlayn and mutajanisayn when the first has a sukun, then then names cases where the letter stays clear, including some that follow a madd letter.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي يُدغم في الحرف بعده (متجانسان).',
        en: 'Tap the letter that is merged into the letter after it (mutajanisayn).',
      },
      verseKey: '109:4',
      rule: 'idgham_mutajanisayn',
    },
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي يُدغم في مثله (مثلان).',
        en: 'Tap the letter that is merged into an identical letter (mithlayn).',
      },
      verseKey: '2:16',
      rule: 'idgham_mithlayn',
      marks: [{ word: 7, letter: 4, rule: 'idgham_mithlayn' }],
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما المثلان؟', en: 'What are mithlayn?' },
      options: [
        { ar: 'حرفان متفقان في المخرج والصفات', en: 'Two letters that agree in place and qualities' },
        { ar: 'حرفان متفقان في المخرج ومختلفان في الصفة', en: 'Two letters that share a place but differ in qualities' },
        { ar: 'حرفان متقاربان في المخرج', en: 'Two letters made at nearby places' },
        { ar: 'حرفان بعيدان في المخرج', en: 'Two letters made at far-apart places' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'المثلان متفقان في المخرج والصفات معًا، كباء وباء.',
        en: 'Mithlayn agree in both place and qualities, like ba and ba.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'الدال والتاء يُدغمان إذا سكن الأول. أي نوع هذا؟', en: 'Dal and ta merge when the first has a sukun. Which kind is this?' },
      options: [
        { ar: 'مثلان', en: 'Mithlayn' },
        { ar: 'متجانسان', en: 'Mutajanisayn' },
        { ar: 'متقاربان', en: 'Mutaqaribayn' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الدال والتاء من مخرج واحد، وصفتاهما مختلفتان: متجانسان.',
        en: 'Dal and ta share a place but differ in qualities: mutajanisayn.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'اللام إذا التقت بالراء، أي نوع هذا؟', en: 'Lam meeting ra: which kind is this?' },
      options: [
        { ar: 'مثلان', en: 'Mithlayn' },
        { ar: 'متجانسان', en: 'Mutajanisayn' },
        { ar: 'متقاربان', en: 'Mutaqaribayn' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'مخرج اللام قريب من مخرج الراء وليس هو نفسه: متقاربان.',
        en: 'The lam’s place is close to the ra’s but not the same: mutaqaribayn.',
      },
    },
  ],
  reviewed: false,
}
