import type { Lesson } from './types'

/** Hafs ʿan ʿAsim by the route of ash-Shatibiyyah: the words written with sad but read with seen, or both (L23). */
export const sadSeen: Lesson = {
  id: 'sad-seen',
  order: 11.2,
  unit: 'hafs-special',
  title: { ar: 'الصاد والسين', en: 'Sad or seen' },
  summary: {
    ar: 'كلمات كُتبت بالصاد، يقرأ حفص بعضها بالسين، وبعضها بالوجهين، وبعضها بالصاد.',
    en: 'Words written with a sad that Hafs reads with a seen, either way, or with the sad.',
  },
  sections: [
    {
      body: {
        ar: 'الصاد والسين من مخرج واحد، وكلاهما حرف صفير، لكن الصاد مستعلية مطبقة (مفخّمة) والسين مستفلة منفتحة (مرقّقة). وهذه أربع كلمات كُتبت بالصاد، يقرؤها حفص على ثلاثة أوجه.',
        en: 'Sad and seen come from the same place and both whistle, but sad is raised and covered (heavy) while seen is low and open (light). Here are four words written with a sad, which Hafs reads in three different ways.',
      },
      animation: 'hafs-sad-seen',
    },
    {
      heading: { ar: 'كيف تعرفها في المصحف', en: 'How to spot them in the mushaf' },
      body: {
        ar: 'سين صغيرة فوق الصاد: تُقرأ بالسين فقط (البقرة ٢٤٥، الأعراف ٦٩). سين صغيرة تحت الصاد: الوجهان، والصاد أشهر (الطور ٣٧). بلا علامة: بالصاد فقط (الغاشية ٢٢). هذا لحفص من طريق الشاطبية.',
        en: 'A small seen over the sad: read with seen only (al-Baqarah 245, al-Aʿraf 69). A small seen under the sad: either way, sad being the more common (at-Tur 37). No sign: sad only (al-Ghashiyah 22). This is Hafs by the Shatibiyyah route.',
      },
    },
  ],
  animation: 'hafs-sad-seen',
  focusRules: ['hafs_special'],
  examples: [
    {
      verseKey: '2:245',
      note: {
        ar: 'الصاد الملوّنة فوقها سين صغيرة: تُقرأ سينًا مرقّقة.',
        en: 'The colored sad has a small seen over it: read it as a light seen.',
      },
      marks: [{ word: 14, letter: 4, rule: 'hafs_special' }],
    },
    {
      verseKey: '7:69',
      note: {
        ar: 'وهنا أيضًا سين صغيرة فوق الصاد الملوّنة: تُقرأ سينًا.',
        en: 'Here too the colored sad has a small seen over it: read it as a seen.',
      },
      marks: [{ word: 22, letter: 2, rule: 'hafs_special' }],
    },
    {
      verseKey: '52:37',
      note: {
        ar: 'السين الصغيرة تحت الصاد الملوّنة: يجوز الوجهان، والصاد هي الأشهر.',
        en: 'The small seen is under the colored sad: either way is allowed, and sad is the more common.',
      },
      marks: [{ word: 7, letter: 4, rule: 'hafs_special' }],
    },
    {
      verseKey: '88:22',
      note: {
        ar: 'لا علامة على الصاد الملوّنة: تُقرأ صادًا فقط.',
        en: 'The colored sad has no sign: read it as a sad only.',
      },
      marks: [{ word: 3, letter: 3, rule: 'hafs_special' }],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 22,
        to: 24,
        note: {
          ar: 'الصاد من حروف الاستعلاء (٢٢) والإطباق (٢٣)، والسين ليست منها، وكلتاهما من حروف الصفير (٢٤). فالفرق بينهما في الاستعلاء والإطباق.',
          en: 'Sad is among the raised letters (22) and the covered letters (23), and seen is not; both are whistling letters (24). So what tells them apart is raising and covering.',
        },
      },
      {
        from: 40,
        note: {
          ar: 'يوصي الناظم بترقيق السين وإن جاورت حرفًا مفخّمًا كالطاء. وكذلك تُقرأ السين في كلمتي البقرة والأعراف: مرقّقة، لا تُفخَّم لأجل الطاء بعدها.',
          en: 'The poet warns to keep a seen light even next to a heavy letter such as ta. So is the seen in the al-Baqarah and al-Aʿraf words: light, not made heavy by the ta after it.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'إذا رأيت سينًا صغيرة فوق الصاد، فكيف تقرأ؟', en: 'A small seen sits over a sad. How do you read it?' },
      options: [
        { ar: 'بالسين', en: 'With a seen' },
        { ar: 'بالصاد', en: 'With a sad' },
        { ar: 'بالوجهين والصاد أشهر', en: 'Either way, sad more common' },
        { ar: 'بالزاي', en: 'With a zay' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'السين الصغيرة فوق الصاد تعني القراءة بالسين (البقرة ٢٤٥، الأعراف ٦٩).',
        en: 'A small seen over the sad means read it with a seen (al-Baqarah 245, al-Aʿraf 69).',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كيف يقرأ حفص الكلمة الملوّنة في الغاشية ٢٢؟', en: 'How does Hafs read the colored word in al-Ghashiyah 22?' },
      options: [
        { ar: 'بالسين فقط', en: 'With seen only' },
        { ar: 'بالصاد فقط', en: 'With sad only' },
        { ar: 'بالوجهين', en: 'Either way' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'لا علامة عليها، فتُقرأ بالصاد فقط.',
        en: 'It has no sign, so it is read with sad only.',
      },
    },
    {
      kind: 'tap',
      prompt: { ar: 'اضغط على الحرف الذي يُقرأ سينًا.', en: 'Tap the letter that is read as a seen.' },
      verseKey: '2:245',
      rule: 'hafs_special',
      marks: [{ word: 14, letter: 4, rule: 'hafs_special' }],
    },
  ],
  reviewed: false,
}
