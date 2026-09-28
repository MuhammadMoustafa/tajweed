import type { Lesson } from './types'

export const makharij: Lesson = {
  id: 'makharij',
  order: 2,
  unit: 'makharij',
  title: { ar: 'مخارج الحروف', en: 'Makharij (where letters come from)' },
  summary: {
    ar: 'لكل حرف موضع يخرج منه، وهي خمسة مواضع: الجوف والحلق واللسان والشفتان والخيشوم.',
    en: 'Every letter comes out from its own place, within five areas: the empty space of the mouth and throat, the throat, the tongue, the lips and the nose.',
  },
  sections: [
    {
      body: {
        ar: 'المَخْرَج هو موضع خروج الحرف الذي يتميّز به عن غيره، وجمعه مَخارج. إذا عرفتَ مخرج الحرف نطقتَه صحيحًا ولم تخلطه بحرف يشبهه، كالعين والهمزة، أو الحاء والهاء.',
        en: 'A makhraj (plural makharij) is the place a letter comes out from, the place that sets it apart from other letters. Knowing it helps you say each letter correctly instead of mixing it up with a similar one, like ʿayn and hamzah, or ḥa and ha.',
      },
    },
    {
      heading: { ar: 'كيف تعرف مخرج الحرف؟', en: "How to find a letter's makhraj" },
      body: {
        ar: 'ضع قبل الحرف همزة متحركة، وانطقه ساكنًا أو مشدّدًا، مثل: «أَبْ»، «أَقْ»، «أَعْ». الموضع الذي ينقطع عنده الصوت هو مخرج الحرف.',
        en: 'Put a hamzah with a vowel before the letter and say the letter with a sukun (or a shaddah), like "أَبْ" (ab), "أَقْ" (aq) or "أَعْ" (aʿ). The spot where the sound stops is the makhraj of that letter.',
      },
    },
    {
      heading: { ar: 'المواضع الخمسة', en: 'The five areas' },
      body: {
        ar: 'تخرج الحروف من خمسة مواضع عامة: الجوف، والحلق، واللسان، والشفتان، والخيشوم. وتنقسم هذه المواضع إلى سبعة عشر مخرجًا تفصيليًّا على المذهب المشهور (مذهب ابن الجزري)، وسنبدأ هنا بالمواضع الخمسة.',
        en: 'Letters come from five main areas: the jawf, the throat, the tongue, the lips and the nose. These areas split into 17 detailed points on the best-known view (that of Ibn al-Jazari), but here we start with the five areas.',
      },
    },
    {
      heading: { ar: '١. الجوف', en: '1. Al-jawf (the empty space)' },
      body: {
        ar: 'الجوف هو الفراغ داخل الحلق والفم، ومنه تخرج حروف المد الثلاثة: الألف الساكنة المفتوح ما قبلها، والواو الساكنة المضموم ما قبلها، والياء الساكنة المكسور ما قبلها. وليس لها موضع محدد ينقطع عنده الصوت، بل تنتهي بانتهاء الهواء.',
        en: 'The jawf is the empty space inside the throat and mouth. The three madd letters come from it: alif (always sakinah, after a fatha), waw sakinah after a damma, and ya sakinah after a kasra. They have no fixed spot where the sound stops; they end when the breath ends.',
      },
      animation: 'makharij-jawf',
    },
    {
      heading: { ar: '٢. الحلق', en: '2. Al-halq (the throat)' },
      body: {
        ar: 'في الحلق ثلاثة مخارج لستة حروف: من أقصاه (أبعده عن الفم) الهمزة والهاء، ومن وسطه العين والحاء، ومن أدناه (أقربه إلى الفم) الغين والخاء.',
        en: 'The throat has three points for six letters: ء ه from its deepest part (farthest from the mouth), ع ح from its middle, and غ خ from its nearest part (closest to the mouth).',
      },
      animation: 'makharij-halq',
    },
    {
      heading: { ar: '٣. اللسان', en: '3. Al-lisan (the tongue)' },
      body: {
        ar: 'اللسان أكثر المواضع حروفًا: فيه عشرة مخارج لثمانية عشر حرفًا. من أقصاه القاف ثم الكاف أسفل منها قليلًا، ومن وسطه الجيم والشين والياء غير المدية، ومن حافته مع الأضراس العليا الضاد، ومن حافته إلى طرفه اللام، ومن طرفه مع اللثة أو الثنايا بقية الحروف: النون والراء والطاء والدال والتاء والصاد والسين والزاي والظاء والذال والثاء.',
        en: 'The tongue has the most letters: ten points for eighteen letters. From its back come ق and then ك, a little closer to the mouth; from its middle ج ش and ي (when it is not a madd letter); from its side, against the upper molars, ض; from its side up to its tip ل; and from its tip, against the gums or the front teeth, the other eleven: ن ر ط د ت ص س ز ظ ذ ث, each at its own spot.',
      },
      animation: 'makharij-lisan',
    },
    {
      heading: { ar: '٤. الشفتان', en: '4. Ash-shafatan (the lips)' },
      body: {
        ar: 'في الشفتين مخرجان لأربعة حروف: الفاء من بطن الشفة السفلى مع أطراف الثنايا العليا، والباء والميم والواو غير المدية من بين الشفتين؛ تنطبقان في الباء والميم، وتنضمّان دون انطباق في الواو.',
        en: 'The lips have two points for four letters: ف from the inside of the lower lip against the tips of the upper front teeth, and ب م و (a waw that is not a madd letter) from both lips, which close for ba and meem and round without closing for waw.',
      },
      animation: 'makharij-shafatan',
    },
    {
      heading: { ar: '٥. الخيشوم', en: '5. Al-khayshum (the nose)' },
      body: {
        ar: 'الخيشوم أعلى الأنف من الداخل، ومنه تخرج الغنة، وهي صوت رخيم يصاحب النون والميم. جرّب أن تمسك أنفك وأنت تنطق نونًا مشدّدة: ينحبس الصوت.',
        en: 'The khayshum is the inner top of the nose. The ghunnah comes from it: a soft humming sound that goes with noon and meem. Try holding your nose while saying a noon with a shaddah: the sound is blocked.',
      },
      animation: 'makharij-khayshum',
    },
  ],
  // No lesson-level clip: each area section carries its own, so the learner controls it and can
  // replay just the area being taught instead of one long tour.
  // No rule is colored here: the notes point at letters and their makharij instead.
  focusRules: [],
  examples: [
    {
      verseKey: '1:2',
      note: {
        ar: 'الحاء في الكلمة الأولى والعين في الكلمة الأخيرة كلاهما من وسط الحلق، والميم والباء من الشفتين، والياء المدية في الكلمة الأخيرة من الجوف.',
        en: 'The ḥa in the first word and the ʿayn in the last word both come from the middle of the throat; the meem and the ba come from the lips; the madd ya in the last word comes from the jawf.',
      },
    },
    {
      verseKey: '112:1',
      note: {
        ar: 'القاف في أول الآية من أقصى اللسان، والهاء من أقصى الحلق، والواو من الشفتين. وفي الكلمة الأخيرة: الهمزة من أقصى الحلق، والحاء من وسطه، والدال من طرف اللسان.',
        en: 'The qaf at the start comes from the back of the tongue, the ha from the deepest part of the throat, and the waw from the lips. In the last word, the hamzah comes from the deepest part of the throat, the ḥa from its middle, and the dal from the tip of the tongue.',
      },
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'الضاد تأتي مرتين في آخر الآية، ومخرجها حافة اللسان مع الأضراس العليا. والغين تأتي مرتين أيضًا، ومخرجها أدنى الحلق.',
        en: 'The ḍad appears twice near the end of the ayah; it comes from the side of the tongue against the upper molars. The ghayn also appears twice, and it comes from the nearest part of the throat.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 9,
        to: 19,
        note: {
          ar: 'باب مخارج الحروف كاملاً: يذكر البيت الأول أن مخارج الحروف سبعة عشر، ثم يعدّدها موضعًا موضعًا من الجوف (الألف وأختاها الواو والياء، حروف المدّ) إلى أقصى الحلق فوسطه فأدناه، فأقصى اللسان فوسطه فحافته فطرفه، فالثنايا والشفتين، وينتهي بغنّة النون والميم التي مخرجها الخيشوم.',
          en: 'The whole chapter on makharij: the first line gives the count — seventeen — then it walks through them one region at a time, from the jawf (the alif and its two "sisters" waw and ya, the madd letters) to the throat (far, middle, near), the tongue (base to tip), the teeth and lips, ending with the ghunnah of noon and meem, whose makhraj is the nose.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'من أي موضع تخرج العين (ع)؟', en: 'Which area does the ʿayn (ع) come from?' },
      options: [
        { ar: 'الحلق', en: 'The throat' },
        { ar: 'اللسان', en: 'The tongue' },
        { ar: 'الشفتان', en: 'The lips' },
        { ar: 'الخيشوم', en: 'The nose' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'العين تخرج من وسط الحلق، ومعها الحاء.',
        en: 'The ʿayn comes from the middle of the throat, together with the ḥa.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي هذه الحروف تخرج من الشفتين؟', en: 'Which of these letters come from the lips?' },
      options: [
        { ar: 'ق ك ج ش', en: 'ق ك ج ش' },
        { ar: 'ف ب م و', en: 'ف ب م و' },
        { ar: 'ء ه ع ح', en: 'ء ه ع ح' },
        { ar: 'ن ر ل ت', en: 'ن ر ل ت' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الفاء من بطن الشفة السفلى مع أطراف الثنايا العليا، والباء والميم والواو من بين الشفتين.',
        en: 'The fa comes from the lower lip with the upper front teeth; the ba, meem and waw come from both lips.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'أي حرفين يخرجان من أقصى الحلق؟',
        en: 'Which two letters come from the deepest part of the throat?',
      },
      options: [
        { ar: 'ع ح', en: 'ع ح' },
        { ar: 'غ خ', en: 'غ خ' },
        { ar: 'ء ه', en: 'ء ه' },
        { ar: 'ق ك', en: 'ق ك' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'الهمزة والهاء من أقصى الحلق، والعين والحاء من وسطه، والغين والخاء من أدناه.',
        en: 'Hamzah and ha come from the deepest part, ʿayn and ḥa from the middle, and ghayn and kha from the nearest part.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الحروف التي تخرج من الجوف؟', en: 'Which letters come from the jawf?' },
      options: [
        { ar: 'حروف الحلق الستة', en: 'The six throat letters' },
        { ar: 'حروف القلقلة', en: 'The qalqalah letters' },
        { ar: 'حروف المد الثلاثة', en: 'The three madd letters' },
        { ar: 'النون والميم', en: 'Noon and meem' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'من الجوف تخرج حروف المد: الألف، والواو الساكنة بعد ضم، والياء الساكنة بعد كسر.',
        en: 'The madd letters come from the jawf: alif, waw sakinah after a damma, and ya sakinah after a kasra.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يخرج من الخيشوم؟', en: 'What comes from the khayshum (the nose)?' },
      options: [
        { ar: 'القلقلة', en: 'Qalqalah' },
        { ar: 'الغنة', en: 'Ghunnah' },
        { ar: 'المد', en: 'Madd' },
        { ar: 'الهمزة', en: 'Hamzah' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الغنة صوت يخرج من الخيشوم ويصاحب النون والميم.',
        en: 'Ghunnah is the humming sound from the nose that goes with noon and meem.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كيف تعرف مخرج حرف ما؟', en: "How do you find a letter's makhraj?" },
      options: [
        {
          ar: 'تنطقه ساكنًا بعد همزة متحركة، وتنظر أين ينقطع الصوت',
          en: 'Say it with a sukun after a hamzah with a vowel, and notice where the sound stops',
        },
        { ar: 'تنطقه بصوت عالٍ جدًا', en: 'Say it very loudly' },
        { ar: 'تمدّه مدًّا طويلًا', en: 'Stretch it for a long time' },
        { ar: 'تكتبه ببطء', en: 'Write it slowly' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'مثل: «أَبْ»، «أَقْ». الموضع الذي ينقطع عنده الصوت هو المخرج.',
        en: 'For example "أَبْ" (ab) or "أَقْ" (aq): where the sound stops is the makhraj.',
      },
    },
  ],
  reviewed: false,
}
