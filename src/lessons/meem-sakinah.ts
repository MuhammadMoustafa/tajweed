import type { Lesson } from './types'

export const meemSakinah: Lesson = {
  id: 'meem-sakinah',
  order: 4.1,
  unit: 'ghunnah-meem',
  title: { ar: 'أحكام الميم الساكنة', en: 'Meem sakinah rules' },
  summary: {
    ar: 'للميم الساكنة ثلاثة أحكام بحسب الحرف الذي بعدها: إخفاء شفوي، وإدغام شفوي، وإظهار شفوي.',
    en: 'A meem with a sukun has three rules, depending on the letter after it: labial ikhfa, labial idgham and labial izhar.',
  },
  sections: [
    {
      body: {
        ar: 'الميم الساكنة هي الميم التي عليها سكون. تخرج من الشفتين، ولهذا تسمى أحكامها «شفوية». وهي ثلاثة أحكام تُعرف بالحرف الذي يأتي بعد الميم.',
        en: 'A meem sakinah is a meem that carries a sukun. It is made with the lips, which is why its rules are called "labial" (shafawi). There are three rules, and the letter after the meem decides which one applies.',
      },
    },
    {
      heading: { ar: 'الإخفاء الشفوي', en: 'Labial ikhfa' },
      body: {
        ar: 'إذا جاءت الباء بعد الميم الساكنة أُخفيت الميم عندها بغنّة مقدارها حركتان، مع إطباق الشفتين برفق. ويُلوَّن هذا الحكم في المصحف بلون الغنّة.',
        en: 'When ba comes after a meem sakinah, the meem is hidden before it with a ghunnah of about two counts, the lips closing gently. A tajweed mushaf colors it with the ghunnah color.',
      },
      animation: 'meem-ikhfa-shafawi',
    },
    {
      heading: { ar: 'الإدغام الشفوي', en: 'Labial idgham' },
      body: {
        ar: 'إذا جاءت ميم بعد الميم الساكنة أُدغمت الأولى في الثانية فصارتا ميمًا واحدة مشددة بغنّة مقدارها حركتان. ويسمى أيضًا إدغام مثلين صغيرًا، لأن الحرفين متماثلان والأول ساكن والثاني متحرك.',
        en: 'When a meem comes after a meem sakinah, the first is merged into the second and they become one doubled meem with a ghunnah of two counts. It is also called the small mithlayn idgham: the two letters are identical, the first with a sukun and the second with a vowel.',
      },
      animation: 'meem-idgham-shafawi',
    },
    {
      heading: { ar: 'الإظهار الشفوي', en: 'Labial izhar' },
      body: {
        ar: 'إذا جاء بعد الميم الساكنة أي حرف غير الباء والميم أُظهرت الميم واضحة من غير إخفاء ولا إدغام. ويُنتبه خاصةً عند الواو والفاء، لأن الواو من الشفتين والفاء قريبة منهما، فقد يُخفي القارئ الميم عندهما خطأً؛ فأطبق الشفتين وأظهر الميم كاملة.',
        en: 'When any letter other than ba and meem follows a meem sakinah, the meem is pronounced clearly, with no hiding and no merging. Take special care before waw and fa: waw is made with the lips and fa is close to them, so a reader may hide the meem by mistake. Close the lips fully and keep the meem clear.',
      },
      animation: 'meem-izhar-shafawi',
    },
  ],
  focusRules: ['ikhafa_shafawi', 'idgham_shafawi', 'izhar_shafawi'],
  examples: [
    {
      verseKey: '105:4',
      note: {
        ar: 'الميم الساكنة في الكلمة الأولى بعدها باء: إخفاء شفوي.',
        en: 'The meem sakinah in the first word is followed by ba: labial ikhfa.',
      },
    },
    {
      verseKey: '104:8',
      note: {
        ar: 'الميم الساكنة في الكلمة الثانية بعدها ميم: إدغام شفوي.',
        en: 'The meem sakinah in the second word is followed by a meem: labial idgham.',
      },
    },
    {
      verseKey: '105:2',
      note: {
        ar: 'الميم الساكنة في الكلمة الثالثة بعدها فاء: إظهار شفوي، فانتبه ولا تُخفها.',
        en: 'The meem sakinah in the third word is followed by fa: labial izhar. Take care not to hide it.',
      },
      marks: [{ word: 3, letter: 5, rule: 'izhar_shafawi' }],
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'ميمان ساكنتان: الأولى في الكلمة الرابعة قبل حرف من حروف الحلق، والثانية في الكلمة السابعة قبل الواو. والحكم فيهما إظهار شفوي.',
        en: 'Two meems with a sukun: the first, in the fourth word, is before a throat letter, and the second, in the seventh word, before waw. Both are labial izhar.',
      },
      marks: [
        { word: 4, letter: 5, rule: 'izhar_shafawi' },
        { word: 7, letter: 5, rule: 'izhar_shafawi' },
      ],
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 18,
        to: 19,
        note: {
          ar: 'الميم الساكنة تأتي قبل جميع الحروف الهجائية إلا ألف لينة، وأحكامها ثلاثة: إخفاء وإدغام وإظهار.',
          en: 'A meem sakinah can come before every letter except a soft alif, and it has three rules: ikhfa, idgham and izhar.',
        },
      },
      {
        from: 20,
        to: 22,
        note: {
          ar: 'الإخفاء عند الباء ويسمى شفويًّا، والإدغام في الميم ويسمى إدغامًا صغيرًا، والإظهار في باقي الحروف ويسمى شفويًّا.',
          en: 'Ikhfa is before ba and is called labial; idgham is into a meem and is called the small idgham; izhar is before all the remaining letters and is called labial.',
        },
      },
      {
        from: 23,
        note: {
          ar: 'تحذير من إخفاء الميم عند الواو والفاء بسبب قرب مخرجهما واتحاده في الشفتين.',
          en: 'A warning against hiding the meem before waw and fa, because their makhraj is close to the meem’s and shares the lips.',
        },
      },
    ],
    jazariyya: [
      {
        from: 63,
        note: {
          ar: 'الميم الساكنة تُخفى بغنّة عند الباء، على القول المختار عند أهل الأداء.',
          en: 'A meem sakinah is hidden with ghunnah before ba, on the view preferred by the masters of recitation.',
        },
      },
      {
        from: 64,
        note: {
          ar: 'تُظهر الميم الساكنة عند باقي الحروف، ويحذّر من إخفائها عند الواو والفاء.',
          en: 'The meem sakinah is made clear before the remaining letters, with a warning not to hide it before waw and fa.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الميم الساكنة التي حكمها إظهار شفوي في هذه الآية.',
        en: 'Tap the meem sakinah in this ayah that has labial izhar.',
      },
      verseKey: '105:2',
      rule: 'izhar_shafawi',
      marks: [{ word: 3, letter: 5, rule: 'izhar_shafawi' }],
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما حكم الميم الساكنة إذا جاءت بعدها باء؟',
        en: 'What is the rule of a meem sakinah followed by ba?',
      },
      options: [
        { ar: 'إخفاء شفوي', en: 'Labial ikhfa' },
        { ar: 'إدغام شفوي', en: 'Labial idgham' },
        { ar: 'إظهار شفوي', en: 'Labial izhar' },
        { ar: 'إقلاب', en: 'Iqlab' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'تُخفى الميم الساكنة عند الباء بغنّة، ويسمى إخفاءً شفويًّا.',
        en: 'The meem sakinah is hidden before ba with ghunnah: labial ikhfa.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما حكم الميم الساكنة إذا جاءت بعدها ميم؟',
        en: 'What is the rule of a meem sakinah followed by another meem?',
      },
      options: [
        { ar: 'إخفاء شفوي', en: 'Labial ikhfa' },
        { ar: 'إدغام شفوي', en: 'Labial idgham' },
        { ar: 'إظهار شفوي', en: 'Labial izhar' },
        { ar: 'قلقلة', en: 'Qalqalah' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'تُدغم الميم الساكنة في الميم بعدها بغنّة، ويسمى إدغامًا شفويًّا أو إدغام مثلين صغيرًا.',
        en: 'It is merged into the meem after it with ghunnah: labial idgham, or the small mithlayn idgham.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'كيف تُنطق الميم الساكنة قبل الواو أو الفاء؟',
        en: 'How is a meem sakinah pronounced before waw or fa?',
      },
      options: [
        { ar: 'واضحة مع إطباق الشفتين', en: 'Clearly, with the lips closed' },
        { ar: 'مخفاة بغنّة', en: 'Hidden with ghunnah' },
        { ar: 'مدغمة في الحرف الذي بعدها', en: 'Merged into the next letter' },
        { ar: 'تُحذف', en: 'Dropped' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'حكمها الإظهار الشفوي، ويُحذَّر من إخفائها عند الواو والفاء لقرب مخرجهما.',
        en: 'Its rule is labial izhar, and one must beware of hiding it before waw and fa because their makhraj is close.',
      },
    },
  ],
  reviewed: false,
}
