import type { Lesson } from './types'

export const lamRules: Lesson = {
  id: 'lam-rules',
  order: 5,
  unit: 'lam-merging',
  title: { ar: 'أحكام اللام', en: 'Lam rules' },
  summary: {
    ar: 'لام «أل» شمسية أو قمرية، ولام اسم الله تُفخَّم أو تُرقَّق.',
    en: 'The lam of "al-" is a sun or a moon lam, and the lam in the name of Allah is heavy or light.',
  },
  sections: [
    {
      body: {
        ar: 'في هذا الدرس حكمان للام: لام «أل» التعريف، وتكون شمسية أو قمرية بحسب الحرف الذي بعدها، ولام اسم الله، وتكون مفخَّمة أو مرقَّقة بحسب الحركة التي قبلها. وألف «أل» همزة وصل: تُنطق في بدء الكلام وتسقط في وصله.',
        en: 'This lesson has two lam rules: the lam of "al-" (the definite article), which is a sun or a moon lam depending on the letter after it, and the lam in the name of Allah, which is heavy or light depending on the vowel before it. The alif of "al-" is a hamzat wasl: it is said when you start, and dropped when you join on.',
      },
    },
    {
      heading: { ar: 'اللام الشمسية', en: 'The sun lam (lam shamsiyyah)' },
      body: {
        ar: 'إذا جاء بعد «أل» حرف من أربعة عشر حرفًا هي: ت ث د ذ ر ز س ش ص ض ط ظ ل ن، فاللام لا تُنطق، ويُشدَّد الحرف الذي بعدها، كأن اللام أُدغمت فيه. وسُمّيت شمسية تشبيهًا باللام في كلمة «الشمس».',
        en: 'When "al-" is followed by one of fourteen letters — ت ث د ذ ر ز س ش ص ض ط ظ ل ن — the lam is not pronounced and the next letter is doubled (it carries a shadda), as if the lam had merged into it. It is called "sun" after the lam of the word for the sun, which behaves this way.',
      },
      animation: 'lam-shamsiyyah',
    },
    {
      heading: { ar: 'اللام القمرية', en: 'The moon lam (lam qamariyyah)' },
      body: {
        ar: 'إذا جاء بعد «أل» حرف من أربعة عشر حرفًا هي: ء ب غ ح ج ك و خ ف ع ق ي م ه، فاللام تُنطق واضحة ساكنة، والحرف الذي بعدها غير مشدَّد. وسُمّيت قمرية تشبيهًا باللام في كلمة «القمر».',
        en: 'When "al-" is followed by one of the other fourteen letters — ء ب غ ح ج ك و خ ف ع ق ي م ه — the lam is pronounced clearly with a sukun, and the next letter has no shadda. It is called "moon" after the lam of the word for the moon, which is pronounced.',
      },
      animation: 'lam-qamariyyah',
    },
    {
      heading: { ar: 'لام اسم الله', en: 'The lam in the name of Allah' },
      body: {
        ar: 'تُفخَّم لام اسم الله إذا سبقتها فتحة أو ضمة، فيمتلئ الفم بصوتها. وتُرقَّق إذا سبقتها كسرة، فيبقى صوتها رقيقًا خفيفًا.',
        en: 'The lam in the name of Allah is heavy (tafkhim) when a fatha or a damma comes before it, so the mouth fills with its sound. It is light (tarqiq) when a kasra comes before it, so its sound stays thin.',
      },
      animation: 'lam-allah',
    },
  ],
  focusRules: ['laam_shamsiyah', 'laam_qamariyah', 'tafkheem', 'tarqeeq'],
  examples: [
    {
      verseKey: '1:1',
      note: {
        ar: 'في الكلمتين الأخيرتين اللام الشمسية الملوَّنة بالرمادي، ولا تُنطق. أما لام اسم الله في الكلمة الثانية فمرقَّقة لأن قبلها كسرة (الميم في الكلمة الأولى).',
        en: 'In the last two words the gray lam is the sun lam, which is not pronounced. The lam of the name of Allah, in the second word, is light because a kasra comes before it (on the last letter of the first word).',
      },
      marks: [{ word: 2, letter: 3, rule: 'tarqeeq' }],
    },
    {
      verseKey: '1:2',
      note: {
        ar: 'اللام في أول كلمة وفي الكلمة الرابعة قمرية: تُنطق واضحة. ولام اسم الله في الكلمة الثانية مرقَّقة لأن قبلها كسرة.',
        en: 'The lam in the first word and in the fourth word is a moon lam: it is pronounced clearly. The lam of the name of Allah, in the second word, is light because a kasra comes before it.',
      },
      marks: [
        { word: 1, letter: 2, rule: 'laam_qamariyah' },
        { word: 2, letter: 2, rule: 'tarqeeq' },
        { word: 4, letter: 2, rule: 'laam_qamariyah' },
      ],
    },
    {
      verseKey: '112:1',
      note: {
        ar: 'لام اسم الله في الكلمة الثالثة مفخَّمة لأن قبلها فتحة (الواو في الكلمة الثانية).',
        en: 'The lam of the name of Allah, in the third word, is heavy because a fatha comes before it (on the last letter of the second word).',
      },
      marks: [{ word: 3, letter: 3, rule: 'tafkheem' }],
    },
    {
      verseKey: '112:2',
      note: {
        ar: 'في الكلمة الثانية لام شمسية لا تُنطق، ويُشدَّد الصاد بعدها. ولام اسم الله في أول الآية مفخَّمة إذا بدأت بها، لأن همزة الوصل تُنطق مفتوحة. أما إذا وصلتها بالآية السابقة فالتنوين في آخرها يُكسر لالتقاء الساكنين، فتُرقَّق اللام.',
        en: 'In the second word the sun lam is not pronounced and the sad after it is doubled. The lam of the name of Allah at the start of the ayah is heavy when you start here, since the hamzat al-wasl is read with a fatha. Joined to the ayah before, the tanween at its end takes a kasra to meet the silent lam, so the lam turns light.',
      },
      marks: [{ word: 1, letter: 3, rule: 'tafkheem' }],
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 24,
        to: 25,
        note: {
          ar: 'يبيّن أن للام «أل» حالين، الأول: الإظهار (وهو القمرية)، ويجمع حروفه في عبارة.',
          en: 'It says that the lam of "al-" has two states. The first is showing it clearly (the moon lam), with its letters gathered in a phrase.',
        },
      },
      {
        from: 26,
        to: 27,
        note: {
          ar: 'الحال الثاني: الإدغام (وهو الشمسية) في أربعة عشر حرفًا، وتجمعها عبارة في البيت الذي بعده.',
          en: 'The second state is merging it into the next letter (the sun lam), in fourteen letters, gathered in a phrase in the next line.',
        },
      },
      {
        from: 28,
        note: {
          ar: 'يسمّي الأولى قمرية والثانية شمسية.',
          en: 'It names the first (shown) the moon lam and the second (merged) the sun lam.',
        },
      },
      {
        from: 29,
        note: {
          ar: 'ويختم فصل اللام بحكم لام الفعل وأنها تُظهَر دائمًا، وهي خارجة عن موضوع هذا الدرس.',
          en: 'It closes the lam section with the lam of a verb, which is always shown clearly; that is outside this lesson.',
        },
      },
    ],
    jazariyya: [
      {
        from: 34,
        to: 36,
        note: {
          ar: 'في باب ترقيق الحروف المستفلة، يذكر من الأمثلة ألفاظ لام اسم الله الواقعة بعد كسرة فيُحذَّر من تفخيمها.',
          en: 'In the passage on keeping the light letters thin, the examples include words with the lam of the name of Allah, so that it is not made heavy.',
        },
      },
      {
        from: 44,
        note: {
          ar: 'يأمر بتفخيم لام اسم الله إذا سبقتها فتحة أو ضمة.',
          en: 'It says to make the lam in the name of Allah heavy when it follows a fatha or a damma.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على اللام القمرية في هذه الآية.',
        en: 'Tap the moon lams in this ayah.',
      },
      verseKey: '1:2',
      rule: 'laam_qamariyah',
      marks: [
        { word: 1, letter: 2, rule: 'laam_qamariyah' },
        { word: 4, letter: 2, rule: 'laam_qamariyah' },
      ],
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما حكم اللام الشمسية؟', en: 'What happens to a sun lam?' },
      options: [
        { ar: 'تُنطق واضحة', en: 'It is pronounced clearly' },
        { ar: 'لا تُنطق ويُشدَّد الحرف بعدها', en: 'It is not pronounced and the next letter is doubled' },
        { ar: 'تُمدّ ست حركات', en: 'It is stretched six counts' },
        { ar: 'تُخفى بغنة', en: 'It is hidden with a nasal sound' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'اللام الشمسية لا تُنطق، ويُشدَّد الحرف الذي بعدها.',
        en: 'The sun lam is not pronounced, and the letter after it carries a shadda.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'متى تُفخَّم لام اسم الله؟',
        en: 'When is the lam in the name of Allah heavy?',
      },
      options: [
        { ar: 'بعد كسرة', en: 'After a kasra' },
        { ar: 'بعد فتحة أو ضمة', en: 'After a fatha or a damma' },
        { ar: 'دائمًا', en: 'Always' },
        { ar: 'أبدًا', en: 'Never' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'تُفخَّم بعد الفتحة والضمة، وتُرقَّق بعد الكسرة.',
        en: 'It is heavy after a fatha or a damma, and light after a kasra.',
      },
    },
  ],
  reviewed: false,
}
