import type { Lesson } from './types'

export const maddLazim: Lesson = {
  id: 'madd-lazim',
  order: 15,
  title: { ar: 'المدّ اللازم', en: 'Necessary madd (al-madd al-lazim)' },
  summary: {
    ar: 'مدّ حرفه سكون أصلي ثابت بعده، فيُمدّ دائمًا ست حركات.',
    en: 'A madd letter followed by a permanent, original sukun — always stretched six counts.',
  },
  sections: [
    {
      body: {
        ar: 'المدّ اللازم أطول المدود كلّها: هو أن يأتي بعد حرف المدّ سكون أصليّ ثابت في الوصل والوقف معًا (لا سكون عارض بسبب الوقف)، فيُمدّ حرف المدّ ست حركات دائمًا، لا تزيد ولا تنقص، ولا خلاف فيها بين القرّاء.',
        en: 'Necessary madd is the longest of all the madds: a permanent sukun — fixed whether you stop or continue — follows the madd letter (not a sukun that only appears from stopping). The madd letter is then stretched exactly six counts, always, with no disagreement among the reciters.',
      },
    },
    {
      heading: { ar: 'أقسامه الأربعة', en: 'Its four kinds' },
      body: {
        ar: 'ينقسم المدّ اللازم إلى كلْميّ وحرفيّ، وكلّ منهما إلى مثقَّل ومخفَّف، فتصير أربعة أقسام. الكلْميّ: يجتمع فيه حرف المدّ والسكون الأصلي داخل كلمة واحدة. الحرفيّ: يقع في حرف من الحروف المقطَّعة في أوائل بعض السور، حين يكون اسم الحرف على ثلاثة أحرف وحرف المدّ في وسطه.',
        en: 'Necessary madd splits into kalimi (within a word) and harfi (within a letter name), and each of those into muthaqqal (with shadda) and mukhaffaf (without it) — four kinds in all. Kalimi: the madd letter and the permanent sukun fall inside one word. Harfi: it occurs in one of the disjointed letters that open some surahs, when that letter\'s spoken name is three letters long with the madd letter in the middle.',
      },
    },
    {
      heading: { ar: 'المثقَّل والمخفَّف', en: 'Muthaqqal and mukhaffaf' },
      body: {
        ar: 'مثقَّل: إذا كان الحرف الساكن بعد حرف المدّ مشدَّدًا (أي حرفين أُدغم أولهما في الثاني)، فيثقل النطق بالتشديد. مخفَّف: إذا كان الحرف الساكن بعد حرف المدّ ساكنًا سكونًا عاديًا من غير إدغام. وكلاهما ست حركات سواء.',
        en: 'Muthaqqal: the letter after the madd letter carries a shadda (two letters, the first merged/idgham\'d into the second), which makes the pronunciation "heavier". Mukhaffaf: the letter after the madd letter is simply sakin, with no merging. Both are six counts all the same.',
      },
      animation: 'madd-lazim-cause',
    },
    {
      heading: { ar: 'المدّ اللازم الحرفي وحروفه', en: 'Harfi necessary madd and its letters' },
      body: {
        ar: 'ثمانية من حروف الهجاء المقطَّعة أسماؤها على ثلاثة أحرف بحرف مدّ في الوسط، يجمعها قولهم «نقص عسلكم»: ن، ق، ص، ع، س، ل، ك، م. كلّها تُمدّ حركتين حركتين مدًا لازمًا حرفيًا (٦ حركات) إذا وقعت في أوائل السور، إلا العين ففيها للقرّاء وجهان (منهم من يمدّها أربع حركات لا ست)؛ وهذا تفصيل لا يُطال فيه هنا. أما بقية الفواتح (ا، ح، ي، ط، ه، ر) فأسماؤها على حرفين فقط، فلا مدّ لازم فيها.',
        en: 'Eight of the disjointed letters have three-letter spoken names with a madd letter in the middle, gathered in the phrase «نقص عسلكم» — ن، ق، ص، ع، س، ل، ك، م. Each one is stretched a necessary harfi madd (6 counts) when it opens a surah, except ʿayn (ع), where reciters differ — some give it only four counts instead of six; that detail is not pursued further here. The rest of the opening letters (ا، ح، ي، ط، ه، ر) have two-letter names, so they carry no necessary madd.',
      },
    },
    {
      heading: { ar: 'كيف تُحسب الحركات الست؟', en: 'How to count the six' },
      body: {
        ar: 'مقدار المدّ اللازم ثلاثة أمثال المدّ الطبيعي: بدل حركتين، حركاته ست — بمقدار فتح ستة أصابع أو قبضها واحدًا واحدًا، ببطء وثبات، ثم الوقوف عند الحرف الساكن أو المشدَّد بعده من غير زيادة.',
        en: 'Necessary madd is three times natural madd: instead of two counts, it holds six — like opening or closing six fingers one at a time, slowly and steadily — then stopping at the sakin or shaddah letter right after it, with no more stretching.',
      },
    },
  ],
  animation: 'madd-lazim-bar',
  focusRules: ['madda_necessary'],
  examples: [
    {
      verseKey: '1:7',
      note: {
        ar: 'مدّ لازم كلْميّ مثقَّل: بعد حرف المدّ الملوَّن يأتي لام مشدَّدة (إدغام) في آخر الآية، داخل كلمة واحدة.',
        en: 'Kalimi muthaqqal necessary madd: right after the colored madd letter comes a shaddah lam (idgham) in the last ayah\'s last word, within one word.',
      },
    },
    {
      verseKey: '10:51',
      note: {
        ar: 'مدّ لازم كلْميّ مخفَّف: بعد حرف المدّ الملوَّن سكون عادي من غير تشديد، داخل كلمة واحدة. هذا النوع نادر، ولا يقع في القرآن إلا هنا وفي موضع آخر من هذه السورة نفسها.',
        en: 'Kalimi mukhaffaf necessary madd: right after the colored madd letter comes a plain sukun, no shaddah, within one word. This kind is rare — it occurs nowhere else in the Quran except here and one other place in this same surah.',
      },
    },
    {
      verseKey: '2:1',
      note: {
        ar: 'مدّ لازم حرفيّ: هذه فاتحة السورة بحروف مقطَّعة. الحرف الأول ألف لا مدّ فيه. أما اللام فاسمها «لام» بمدّ لازم حرفيّ مثقَّل، لأن الميم الساكنة في آخر اسمها تُدغم في الميم التي يبدأ بها اسم «ميم» بعدها. والميم اسمها «ميم» بمدّ لازم حرفيّ مخفَّف (سكونها العادي في آخر اسمها).',
        en: 'Harfi necessary madd: this is the surah\'s opening, in disjointed letters. The first, alif, carries no madd. Lam\'s spoken name is "laam", a muthaqqal harfi necessary madd, because the sakin meem that ends its name merges into the meem that starts the next letter’s name, "meem". Meem\'s spoken name is "meem", a mukhaffaf harfi necessary madd (a plain sukun ends its name).',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 47,
        to: 57,
        note: {
          ar: 'يعرّف هذا البيت المدّ اللازم بأنه ما كان السكون بعد حرفه أصليًا ثابتًا وصلًا ووقفًا، ثم تفصّل الأبيات التالية أقسامه الأربعة (كلْمي/حرفي، مثقَّل/مخفَّف) وحروف القسم الحرفي الثمانية.',
          en: 'This line defines necessary madd as one where the sukun after its letter is original and fixed whether you stop or continue, and the following lines detail its four kinds (kalimi/harfi, muthaqqal/mukhaffaf) and the eight letters of the harfi kind.',
        },
      },
    ],
    jazariyya: [
      {
        from: 69,
        to: 70,
        note: {
          ar: 'يسمّي هذا الموضع اللازم أول أقسام المدّ الأربعة، ثم يعرّفه بأنه ما جاء بعد حرف المدّ فيه سكون في الحالين (الوصل والوقف)، ويُمدّ بالطول (ست حركات).',
          en: 'This passage names lazim first among the four kinds of madd, then defines it as a sukun coming after the madd letter in both cases (continuing or stopping), stretched fully (six counts).',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على الحرف الذي فيه مدّ لازم في هذه الآية.',
        en: 'Tap the letter in this ayah that has a necessary madd.',
      },
      verseKey: '1:7',
      rule: 'madda_necessary',
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم عدد حركات المدّ اللازم؟', en: 'How many counts does necessary madd have?' },
      options: [
        { ar: '٢', en: '2' },
        { ar: '٤', en: '4' },
        { ar: '٥', en: '5' },
        { ar: '٦', en: '6' },
      ],
      correctIndex: 3,
      explanation: {
        ar: 'المدّ اللازم دائمًا ست حركات، لا خلاف فيها بين القرّاء.',
        en: 'Necessary madd is always six counts, with no disagreement among reciters.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما الذي يجعل المدّ لازمًا؟',
        en: 'What makes a madd "necessary" (lazim)?',
      },
      options: [
        { ar: 'همزة بعد حرف المدّ', en: 'A hamza right after the madd letter' },
        { ar: 'سكون أصلي ثابت بعد حرف المدّ في الوصل والوقف', en: 'A permanent sukun after the madd letter, fixed whether you stop or continue' },
        { ar: 'الوقف على آخر الآية', en: 'Stopping at the end of the ayah' },
        { ar: 'قصر الحركة إلى حركة واحدة', en: 'Shortening the count to one' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'المدّ اللازم سببه سكون أصلي ثابت لا يزول، بخلاف المدّ العارض للسكون الذي سببه الوقف فقط.',
        en: 'Necessary madd is caused by a permanent sukun that never goes away — unlike ʿarid lis-sukun madd, whose sukun only appears from stopping.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما الفرق بين المدّ اللازم المثقَّل والمخفَّف؟',
        en: 'What is the difference between muthaqqal and mukhaffaf necessary madd?',
      },
      options: [
        { ar: 'المثقَّل فيه إدغام وتشديد بعد حرف المدّ، والمخفَّف سكون عادي', en: 'Muthaqqal has a shaddah (idgham) right after the madd letter; mukhaffaf has a plain sukun' },
        { ar: 'المثقَّل أطول من المخفَّف', en: 'Muthaqqal is longer than mukhaffaf' },
        { ar: 'المخفَّف لا يقع إلا في أول السور', en: 'Mukhaffaf only occurs at the start of surahs' },
        { ar: 'لا فرق بينهما', en: 'There is no difference' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'كلاهما ست حركات؛ الفرق فقط في وجود التشديد بعد حرف المدّ (مثقَّل) أو عدمه (مخفَّف).',
        en: 'Both are six counts; the only difference is whether a shaddah follows the madd letter (muthaqqal) or not (mukhaffaf).',
      },
    },
  ],
  reviewed: false,
}
