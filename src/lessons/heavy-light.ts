import type { Lesson } from './types'

export const heavyLight: Lesson = {
  id: 'heavy-light',
  order: 7,
  unit: 'heavy-light',
  title: { ar: 'التفخيم والترقيق', en: 'Heavy and light letters (tafkhim and tarqiq)' },
  summary: {
    ar: 'سبعة حروف تُنطق مفخَّمة دائمًا، وبقية الحروف مرقَّقة.',
    en: 'Seven letters are always pronounced heavy; the rest are light.',
  },
  sections: [
    {
      body: {
        ar: 'التفخيم: أن يمتلئ الفم بصدى الحرف فيخرج غليظًا. الترقيق: أن يخرج الحرف رقيقًا نحيلًا لا يمتلئ الفم به. ويكون ذلك بحركة اللسان: في التفخيم يرتفع أقصى اللسان نحو الحنك، وفي الترقيق يبقى منخفضًا.',
        en: 'Tafkhim is when the sound of the letter fills the mouth and comes out full. Tarqiq is when the letter comes out thin, without filling the mouth. It comes from the tongue: for a heavy letter the back of the tongue rises toward the palate; for a light letter it stays low.',
      },
      animation: 'heavy-light',
    },
    {
      heading: { ar: 'حروف الاستعلاء', en: 'The seven heavy letters' },
      body: {
        ar: 'سبعة حروف مفخَّمة دائمًا، أيًّا كانت حركتها: خ ص ض غ ط ق ظ. يجمعها قولهم: «خُصَّ ضَغْطٍ قِظْ» (عبارة للحفظ فقط). وتسمى حروف الاستعلاء لأن اللسان يستعلي، أي يرتفع، عند النطق بها.',
        en: 'Seven letters are always heavy, whatever vowel they carry: خ ص ض غ ط ق ظ. They are gathered in the memory phrase "khuṣṣa ḍaghṭin qiẓ" (only a mnemonic). They are called the letters of isti\u02bfla because the tongue rises when they are pronounced.',
      },
    },
    {
      heading: { ar: 'باقي الحروف', en: 'All the other letters' },
      body: {
        ar: 'كل الحروف الأخرى مرقَّقة. وثلاثة أحرف تتغير بحسب موضعها فتُفخَّم مرة وتُرقَّق أخرى: الراء، واللام في اسم الله، والألف. أما اللام في اسم الله فتعلمتها في درس اللام، وللراء درس خاص يلي هذا الدرس، فلا نحكم على الراء الآن.',
        en: 'Every other letter is light. Three letters vary with where they appear, sometimes heavy and sometimes light: ra, the lam in the name of Allah, and alif. The lam in the name of Allah was covered in the lam lesson, and ra has a lesson of its own right after this one, so do not judge ra yet.',
      },
    },
    {
      heading: { ar: 'درجات التفخيم', en: 'Strength of the heaviness' },
      body: {
        ar: 'التفخيم يقوى ويضعف بحسب حركة الحرف: أقواه مع الفتح، ثم الضم، ثم الكسر. وأقوى الحروف المفخَّمة الصاد والضاد والطاء والظاء (المُطبَقة). نكتفي هنا بمعرفة أن الحرف يبقى مفخَّمًا حتى مع الكسرة.',
        en: 'Heaviness is stronger or weaker with the vowel: strongest with fatha, then damma, then kasra. The strongest heavy letters are ṣad, ḍad, ṭa and ẓa. For now it is enough to know that a heavy letter stays heavy even with a kasra.',
      },
    },
  ],
  animation: 'heavy-light',
  focusRules: ['tafkheem', 'tarqeeq'],
  examples: [
    {
      verseKey: '1:6',
      note: {
        ar: 'الحرف الأزرق مفخَّم (الصاد والطاء في الكلمة الثانية، والقاف في الكلمة الثالثة)، والأخضر مرقَّق.',
        en: 'The blue letters are heavy (the ṣad and ṭa in the second word, the qaf in the third); the green ones are light.',
      },
      marks: [
        { word: 2, letter: 3, rule: 'tafkheem' },
        { word: 2, letter: 6, rule: 'tafkheem' },
        { word: 3, letter: 6, rule: 'tafkheem' },
        { word: 1, letter: 2, rule: 'tarqeeq' },
        { word: 3, letter: 4, rule: 'tarqeeq' },
      ],
    },
    {
      verseKey: '108:1',
      note: {
        ar: 'الطاء في الكلمة الثانية مفخَّمة، والحرفان الملوَّنان بالأخضر مرقَّقان.',
        en: 'The ṭa in the second word is heavy; the two letters colored green are light.',
      },
      marks: [
        { word: 2, letter: 3, rule: 'tafkheem' },
        { word: 2, letter: 1, rule: 'tarqeeq' },
        { word: 2, letter: 7, rule: 'tarqeeq' },
      ],
    },
    {
      verseKey: '112:1',
      note: {
        ar: 'القاف في أول الآية مفخَّمة.',
        en: 'The qaf at the start of the ayah is heavy.',
      },
      marks: [
        { word: 1, letter: 1, rule: 'tafkheem' },
        { word: 2, letter: 1, rule: 'tarqeeq' },
        { word: 4, letter: 2, rule: 'tarqeeq' },
      ],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 22,
        note: {
          ar: 'في عجز البيت حروف الاستعلاء السبعة مجموعة في «خُصَّ ضَغْطٍ قِظْ»، ضمن أبيات الصفات.',
          en: 'The second half of this line names the seven letters of isti\u02bfla, gathered in "khuṣṣa ḍaghṭin qiẓ", among the lines on characteristics.',
        },
      },
      {
        from: 34,
        note: {
          ar: 'بداية باب التفخيم والترقيق: رقِّق الحروف المستفلة، وحذّر من تفخيم الألف.',
          en: 'The start of the chapter on tafkhim and tarqiq: make the low (light) letters thin, and beware of making the alif heavy.',
        },
      },
      {
        from: 45,
        note: {
          ar: 'فخِّم حروف الاستعلاء، واخصص بمزيد التفخيم حروف الإطباق.',
          en: 'Make the isti\u02bfla letters heavy, and give extra heaviness to the closed letters (ṣad, ḍad, ṭa, ẓa).',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'كم عدد حروف الاستعلاء؟', en: 'How many letters of isti\u02bfla (always heavy) are there?' },
      options: [
        { ar: '٣', en: '3' },
        { ar: '٥', en: '5' },
        { ar: '٧', en: '7' },
        { ar: '١٠', en: '10' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'سبعة: خ ص ض غ ط ق ظ.',
        en: 'Seven: خ ص ض غ ط ق ظ.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي مجموعة هي حروف الاستعلاء؟',
        en: 'Which group is the letters of isti\u02bfla?',
      },
      options: [
        { ar: 'خ ص ض غ ط ق ظ', en: 'خ ص ض غ ط ق ظ' },
        { ar: 'ق ط ب ج د', en: 'ق ط ب ج د' },
        { ar: 'ء ه ع ح غ خ', en: 'ء ه ع ح غ خ' },
        { ar: 'س ش ز ذ ث', en: 'س ش ز ذ ث' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'حروف الاستعلاء: خ ص ض غ ط ق ظ.',
        en: 'The letters of isti\u02bfla are خ ص ض غ ط ق ظ.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ماذا يفعل أقصى اللسان عند النطق بحرف مفخَّم؟',
        en: 'What does the back of the tongue do for a heavy letter?',
      },
      options: [
        { ar: 'يرتفع نحو الحنك', en: 'It rises toward the palate' },
        { ar: 'يبقى منخفضًا', en: 'It stays low' },
        { ar: 'يلتصق بالأسنان', en: 'It touches the teeth' },
        { ar: 'لا يتحرك أي جزء من اللسان', en: 'No part of the tongue moves' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'في التفخيم يرتفع أقصى اللسان نحو الحنك؛ وفي الترقيق يبقى منخفضًا.',
        en: 'For a heavy letter the back of the tongue rises toward the palate; for a light one it stays low.',
      },
    },
  ],
  reviewed: false,
}
