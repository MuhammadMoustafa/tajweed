import type { Lesson } from './types'

export const makharijLisan: Lesson = {
  id: 'makharij-lisan',
  order: 2.3,
  unit: 'makharij',
  title: { ar: 'مخارج الحروف: اللسان', en: 'Makharij: al-lisan (the tongue)' },
  summary: {
    ar: 'في اللسان عشرة مخارج لثمانية عشر حرفًا، من أقصاه إلى طرفه.',
    en: 'The tongue has ten makharij for eighteen letters, from its back to its tip.',
  },
  sections: [
    {
      body: {
        ar: 'اللسان أكثر المواضع مخارج وحروفًا: فيه عشرة مخارج لثمانية عشر حرفًا. نمرّ عليها من أقصى اللسان مما يلي الحلق إلى طرفه. وبعض العلماء جعل اللام والنون والراء مخرجًا واحدًا، أما على مذهب ابن الجزري الذي نتبعه فلكل منها مخرجه.',
        en: 'The tongue has the most makharij and letters: ten points for eighteen letters. We go from its back, next to the throat, to its tip. Some scholars counted lam, noon and ra as one point; on Ibn al-Jazari\'s count, which we follow, each has its own.',
      },
    },
    {
      heading: { ar: 'أقصى اللسان: ق، ك', en: 'The back of the tongue: qaf, kaf' },
      body: {
        ar: 'القاف من أقصى اللسان مما يلي الحلق مع ما فوقه من الحنك الأعلى، والكاف من أقصى اللسان أيضًا لكن أسفل من مخرج القاف قليلًا مما يلي الفم. وهما مخرجان.',
        en: 'Qaf comes from the back of the tongue, next to the throat, against the palate above it. Kaf also comes from the back of the tongue, a little lower than qaf, toward the mouth. They are two points.',
      },
    },
    {
      heading: { ar: 'وسط اللسان: ج، ش، ي', en: 'The middle of the tongue: jeem, sheen, ya' },
      body: {
        ar: 'الجيم والشين والياء غير المدية من وسط اللسان مع ما فوقه من وسط الحنك الأعلى.',
        en: 'Jeem, sheen and a ya that is not a madd letter come from the middle of the tongue, against the middle of the palate above it.',
      },
    },
    {
      heading: { ar: 'حافة اللسان: ض، ل', en: 'The side of the tongue: ḍad, lam' },
      body: {
        ar: 'الضاد من إحدى حافتي اللسان أو كلتيهما مع ما يليها من الأضراس العليا، ومن اليسرى أيسر وأكثر. واللام من أدنى حافة اللسان إلى منتهى طرفه، مع ما يحاذيها من لثة الأسنان العليا. وهما مخرجان.',
        en: 'Ḍad comes from one side of the tongue, or both, against the upper molars next to it; the left side is easier and more common. Lam comes from the front of the side of the tongue up to its very tip, against the gums of the upper teeth. They are two points.',
      },
    },
    {
      heading: { ar: 'طرف اللسان: ن، ر، ثم ثلاث مجموعات', en: 'The tip of the tongue: noon, ra, then three groups' },
      body: {
        ar: 'النون من طرف اللسان مع لثة الثنايا العليا، تحت مخرج اللام قليلًا. والراء قريبة من مخرج النون لكنها أدخل إلى ظهر اللسان قليلًا. ثم الطاء والدال والتاء من طرف اللسان مع أصول الثنايا العليا. ثم الصاد والزاي والسين من طرف اللسان فوق الثنايا السفلى، مع فُرجة قليلة يخرج منها صفيرها. ثم الظاء والذال والثاء من طرف اللسان مع أطراف الثنايا العليا. فهذه خمسة مخارج.',
        en: "Noon comes from the tip of the tongue against the gums of the upper front teeth, a little below lam's point. Ra is close to noon's point but a little further in, onto the top of the tongue. Then ṭa, dal and ta come from the tip of the tongue against the roots of the upper front teeth; ṣad, zay and seen from the tip of the tongue just above the lower front teeth, with a small gap for their whistle; and ẓa, dhal and tha from the tip of the tongue against the edges of the upper front teeth. That makes five points.",
      },
    },
  ],
  animation: 'makharij-lisan',
  // No rule is colored here: the notes point at the tongue letters and where they come from.
  focusRules: [],
  examples: [
    {
      verseKey: '112:1',
      note: {
        ar: 'القاف في أول الآية من أقصى اللسان، واللام بعدها من حافته إلى طرفه، والدال في آخر الآية من طرف اللسان مع أصول الثنايا العليا.',
        en: 'The qaf at the start of the ayah comes from the back of the tongue, the lam right after it from the side of the tongue to its tip, and the dal at the end of the ayah from the tip of the tongue against the roots of the upper front teeth.',
      },
    },
    {
      verseKey: '108:1',
      note: {
        ar: 'الكاف في آخر الكلمة الثانية وفي الكلمة الأخيرة من أقصى اللسان أسفل مخرج القاف، والطاء في الكلمة الثانية من طرف اللسان مع أصول الثنايا، والثاء في الكلمة الأخيرة من طرف اللسان مع أطراف الثنايا العليا.',
        en: 'The kaf at the end of the second word and in the last word comes from the back of the tongue, just below qaf\'s point; the ṭa in the second word from the tip of the tongue against the roots of the upper front teeth; and the tha in the last word from the tip of the tongue against the edges of the upper front teeth.',
      },
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'الصاد في أول الآية من طرف اللسان فوق الثنايا السفلى، والطاء في آخر الكلمة نفسها من طرفه مع أصول الثنايا العليا، والذال في الكلمة الثانية من طرفه مع أطراف الثنايا العليا، والضاد في الكلمة السادسة والأخيرة من حافة اللسان مع الأضراس العليا.',
        en: 'The ṣad at the start of the ayah comes from the tip of the tongue just above the lower front teeth, the ṭa at the end of that word from the tip against the roots of the upper front teeth, the dhal in the second word from the tip against the edges of the upper front teeth, and the ḍad in the sixth and last words from the side of the tongue against the upper molars.',
      },
    },
    {
      verseKey: '94:3',
      note: {
        ar: 'الظاء في أول الكلمة الأخيرة من طرف اللسان مع أطراف الثنايا العليا، والضاد في آخر الكلمة التي قبلها من حافة اللسان مع الأضراس العليا: فرّق بين مخرجيهما.',
        en: 'The ẓa at the start of the last word comes from the tip of the tongue against the edges of the upper front teeth, and the ḍad at the end of the word before it from the side of the tongue against the upper molars: keep their two points apart.',
      },
    },
    {
      verseKey: '114:4',
      note: {
        ar: 'الشين في الكلمة الثانية من وسط اللسان، والراء بعدها قريبة من مخرج النون، والسين في الكلمتين الأخيرتين من طرف اللسان فوق الثنايا السفلى، والنون المشددة في الكلمة الأخيرة من طرف اللسان مع لثة الثنايا العليا.',
        en: 'The sheen in the second word comes from the middle of the tongue, the ra after it from close to noon\'s point, the seen in the last two words from the tip of the tongue just above the lower front teeth, and the noon with shaddah in the last word from the tip of the tongue against the gums of the upper front teeth.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 12,
        to: 18,
        note: {
          ar: 'مخارج اللسان العشرة، من آخر البيت الثاني عشر إلى أول الثامن عشر: القاف من أقصاه، والكاف أسفل منها، ومن وسطه الجيم والشين والياء، والضاد من حافته مع الأضراس من اليسار أو اليمين، واللام من أدنى حافته إلى منتهاها، والنون من طرفه تحت اللام، والراء قريبة منها أدخل إلى ظهره، والطاء والدال والتاء منه ومن الثنايا العليا، وحروف الصفير (الصاد والزاي والسين) منه ومن فوق الثنايا السفلى، والظاء والذال والثاء منه ومن طرفي الثنايا العليا.',
          en: "The tongue's ten makharij, from the end of line 12 to the start of line 18: qaf from its back and kaf a little lower; jeem, sheen and ya from its middle; ḍad from its side against the molars, left or right; lam from the front of its side up to the tip; noon from the tip, below lam; ra close to noon, further in toward the top of the tongue; ṭa, dal and ta from the tip with the upper front teeth; the whistling letters (ṣad, zay and seen) from the tip, just above the lower front teeth; and ẓa, dhal and tha from the tip with the edges of the upper front teeth.",
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'من أي مخرج تخرج الضاد؟', en: 'Which point does ḍad come from?' },
      options: [
        { ar: 'طرف اللسان مع أطراف الثنايا العليا', en: 'The tip of the tongue with the edges of the upper front teeth' },
        { ar: 'حافة اللسان مع الأضراس العليا', en: 'The side of the tongue with the upper molars' },
        { ar: 'وسط اللسان مع الحنك الأعلى', en: 'The middle of the tongue with the palate' },
        { ar: 'أدنى الحلق', en: 'The nearest part of the throat' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الضاد من إحدى حافتي اللسان أو كلتيهما مع الأضراس العليا، ومن اليسرى أيسر.',
        en: 'Ḍad comes from one side of the tongue, or both, against the upper molars; the left side is easier.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي الحروف تخرج من وسط اللسان؟', en: 'Which letters come from the middle of the tongue?' },
      options: [
        { ar: 'ق ك', en: 'ق ك' },
        { ar: 'ج ش ي', en: 'ج ش ي' },
        { ar: 'ط د ت', en: 'ط د ت' },
        { ar: 'ل ن ر', en: 'ل ن ر' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الجيم والشين والياء غير المدية من وسط اللسان مع ما فوقه من الحنك الأعلى.',
        en: 'Jeem, sheen and a ya that is not a madd letter come from the middle of the tongue, against the palate above it.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي الحروف تخرج من طرف اللسان مع أطراف الثنايا العليا؟',
        en: 'Which letters come from the tip of the tongue with the edges of the upper front teeth?',
      },
      options: [
        { ar: 'ص ز س', en: 'ص ز س' },
        { ar: 'ط د ت', en: 'ط د ت' },
        { ar: 'ظ ذ ث', en: 'ظ ذ ث' },
        { ar: 'ف ب م', en: 'ف ب م' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'الظاء والذال والثاء من طرف اللسان مع أطراف الثنايا العليا.',
        en: 'Ẓa, dhal and tha come from the tip of the tongue against the edges of the upper front teeth.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي حرف يخرج من أقصى اللسان أسفل من مخرج القاف قليلًا؟',
        en: "Which letter comes from the back of the tongue, a little lower than qaf's point?",
      },
      options: [
        { ar: 'الكاف', en: 'Kaf' },
        { ar: 'الغين', en: 'Ghayn' },
        { ar: 'الجيم', en: 'Jeem' },
        { ar: 'الخاء', en: 'Kha' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الكاف من أقصى اللسان أسفل من مخرج القاف قليلًا مما يلي الفم.',
        en: 'Kaf comes from the back of the tongue, a little lower than qaf, toward the mouth.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'اللام والنون والراء على مذهب ابن الجزري:',
        en: "On Ibn al-Jazari's count, lam, noon and ra come from:",
      },
      options: [
        { ar: 'مخرج واحد', en: 'One point' },
        { ar: 'ثلاثة مخارج متقاربة', en: 'Three close but separate points' },
        { ar: 'الخيشوم', en: 'The khayshum' },
        { ar: 'الشفتين', en: 'The lips' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'اللام من حافة اللسان إلى طرفه، والنون من طرفه تحتها، والراء قريبة من النون أدخل إلى ظهر اللسان.',
        en: 'Lam comes from the side of the tongue up to its tip, noon from the tip just below it, and ra close to noon, further in toward the top of the tongue.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم مخرجًا في اللسان؟', en: 'How many makharij are on the tongue?' },
      options: [
        { ar: 'ثلاثة', en: 'Three' },
        { ar: 'خمسة', en: 'Five' },
        { ar: 'عشرة', en: 'Ten' },
        { ar: 'ثمانية عشر', en: 'Eighteen' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'عشرة مخارج لثمانية عشر حرفًا.',
        en: 'Ten makharij, for eighteen letters.',
      },
    },
  ],
  reviewed: false,
}
