import type { Lesson } from './types'

export const muttasilMunfasil: Lesson = {
  id: 'muttasil-munfasil',
  order: 14,
  title: { ar: 'المد الواجب المتصل والمد الجائز المنفصل', en: 'Madd wajib muttasil and madd jaiz munfasil' },
  summary: {
    ar: 'إذا جاءت همزة بعد حرف المدّ صار المدّ فرعيًا: واجبًا متصلًا إن كانا في كلمة واحدة، وجائزًا منفصلًا إن فُصِلا بكلمتين.',
    en: 'When a hamza follows a madd letter, the madd becomes secondary: obligatory (wajib) and connected (muttasil) if they are in one word, or permissible (jaiz) and separated (munfasil) if they are split across two words.',
  },
  sections: [
    {
      body: {
        ar: 'رأينا في المدّ الطبيعي أنه يحتاج فقط حرف مدّ من غير همزة أو سكون بعده. فإذا جاءت همزة بعد حرف المدّ مباشرة، طال المدّ عن حركتيه الطبيعيتين، وصار له اسم آخر بحسب مكان الهمزة.',
        en: 'Natural madd needs only a madd letter with no hamza or sukun right after it. When a hamza follows the madd letter directly, the madd stretches beyond its natural two counts, and takes a different name depending on where that hamza falls.',
      },
    },
    {
      heading: { ar: 'المدّ الواجب المتصل', en: 'Madd wajib muttasil' },
      body: {
        ar: 'إذا وقعت الهمزة بعد حرف المدّ في نفس الكلمة، سُمّي المدّ واجبًا متصلًا: واجب لأن كل القراء يمدّونه، ومتصل لأن حرف المدّ والهمزة متصلان في كلمة واحدة لا ينفصلان في الوقف ولا في الوصل. مقداره عند حفص من طريق الشاطبية أربع أو خمس حركات.',
        en: 'When the hamza falls right after the madd letter in the same word, the madd is called wajib (obligatory) muttasil (connected): obligatory because every reciter lengthens it, and connected because the madd letter and the hamza stay joined in one word whether you stop or continue. For Hafs via the Shatibiyyah, it is 4 or 5 counts.',
      },
      animation: 'madd-muttasil',
    },
    {
      heading: { ar: 'المدّ الجائز المنفصل', en: 'Madd jaiz munfasil' },
      body: {
        ar: 'إذا وقع حرف المدّ في آخر كلمة، ووقعت الهمزة في أول الكلمة التالية، سُمّي المدّ جائزًا منفصلًا: جائز لأن بعض القراء يمدّه وبعضهم يقصره، ومنفصل لأن حرف المدّ والهمزة في كلمتين منفصلتين. عند حفص من طريق الشاطبية يُمدّ بنفس مقدار المتصل: أربع أو خمس حركات.',
        en: 'When the madd letter ends one word, and the hamza starts the next word, the madd is called jaiz (permissible) munfasil (separated): permissible because some reciters lengthen it and others shorten it, and separated because the madd letter and the hamza sit in two different words. For Hafs via the Shatibiyyah, it takes the same length as muttasil: 4 or 5 counts.',
      },
      animation: 'madd-munfasil',
    },
    {
      heading: { ar: 'مقدار واحد طوال القراءة', en: 'One length throughout a recitation' },
      body: {
        ar: 'يجوز في الشاطبية لحفص أن يُمدّ المتصل والمنفصل أربع حركات أو خمسًا، لكن يجب التزام مقدار واحد لهما طوال القراءة، فلا يُمدّ المتصل أربعًا في موضع وخمسًا في موضع آخر من نفس القراءة.',
        en: 'The Shatibiyyah allows Hafs to lengthen muttasil and munfasil either 4 or 5 counts, but whichever length is chosen must stay the same throughout the whole recitation — never 4 counts in one place and 5 in another within the same reading.',
      },
    },
  ],
  focusRules: ['madda_obligatory'],
  examples: [
    {
      verseKey: '110:1',
      note: {
        ar: 'المدّ الملوَّن هنا في الكلمة الثانية: حرف المدّ والهمزة في نفس الكلمة، فهو مدّ واجب متصل.',
        en: 'The colored madd here is in the second word: the madd letter and the hamza are in the same word, so this is madd wajib muttasil.',
      },
    },
    {
      verseKey: '85:1',
      note: {
        ar: 'المدّ الملوَّن هنا في الكلمة الأولى: حرف المدّ والهمزة في كلمة واحدة (بعد لام التعريف)، فهو مدّ واجب متصل.',
        en: 'The colored madd here is in the first word: the madd letter and the hamza are in one word (after the definite article), so this is madd wajib muttasil.',
      },
    },
    {
      verseKey: '74:1',
      note: {
        ar: 'المدّ الملوَّن هنا في آخر الكلمة الأولى، وتليها كلمة تبدأ بهمزة؛ ولا فرق بينهما في رسم المصحف هنا، لكنهما كلمتان مستقلتان، فهو مدّ جائز منفصل.',
        en: 'The colored madd here ends the first word, and the next word starts with a hamza; the mushaf script shows no visible gap here, but they are still two separate words, so this is madd jaiz munfasil.',
      },
    },
    {
      verseKey: '97:1',
      note: {
        ar: 'المدّ الملوَّن هنا في نهاية الكلمة الأولى، والهمزة في بداية الكلمة الثانية، فهو مدّ جائز منفصل — بخلاف الياء الطبيعية غير الملوّنة هنا في وسط الآية.',
        en: 'The colored madd here is at the end of the first word, and the hamza starts the second word, so this is madd jaiz munfasil — unlike the uncolored natural madd letter in the middle of the ayah.',
      },
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 42,
        to: 44,
        note: {
          ar: 'تذكر هذه الأبيات أن للمدّ ثلاثة أحكام (الوجوب، والجواز، واللزوم)، ثم تُعرِّف الواجب المتصل والجائز المنفصل بمكان الهمزة من الكلمة.',
          en: 'These lines name the three rulings a madd can have (wajib, jaiz, luzum), then define wajib muttasil and jaiz munfasil by where the hamza falls relative to the word.',
        },
      },
    ],
    jazariyya: [
      {
        from: 69,
        to: 69,
        note: {
          ar: 'يذكر هذا البيت أنواع المدّ الأربعة: اللازم والواجب والجائز والقصر.',
          en: 'This line names the four kinds of madd: lazim, wajib, jaiz, and qasr (shortening).',
        },
      },
      {
        from: 71,
        to: 72,
        note: {
          ar: 'يُعرِّف هذان البيتان الواجب بأن الهمزة بعد حرف المدّ في كلمة واحدة (المتصل)، والجائز بأن الهمزة في كلمة منفصلة (المنفصل)، أو بعروض السكون وقفًا (درس لاحق).',
          en: 'These two lines define wajib as the hamza coming after the madd letter within one word (muttasil), and jaiz as the hamza being in a separate word (munfasil) — or the sukun only arising from a stop (a later lesson).',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على حرف المدّ الذي بعده همزة في نفس الكلمة (مدّ واجب متصل).',
        en: 'Tap the madd letter that has a hamza right after it, in the same word (madd wajib muttasil).',
      },
      verseKey: '110:1',
      rule: 'madda_obligatory',
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما الفرق بين المدّ الواجب المتصل والمدّ الجائز المنفصل؟',
        en: 'What is the difference between madd wajib muttasil and madd jaiz munfasil?',
      },
      options: [
        { ar: 'طول المدّ فقط', en: 'Only how long the madd is' },
        {
          ar: 'المتصل: حرف المدّ والهمزة في كلمة واحدة. المنفصل: حرف المدّ آخر كلمة والهمزة أول الكلمة التالية',
          en: 'Muttasil: the madd letter and hamza are in one word. Munfasil: the madd letter ends one word and the hamza starts the next',
        },
        { ar: 'المتصل في القرآن، والمنفصل في الشعر فقط', en: 'Muttasil is only in the Quran, munfasil only in poetry' },
        { ar: 'لا فرق بينهما', en: 'There is no difference between them' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'العبرة بمكان الهمزة من الكلمة: في نفس كلمة حرف المدّ فهو متصل، وفي الكلمة التالية فهو منفصل.',
        en: 'What matters is where the hamza falls: in the same word as the madd letter it is muttasil, in the next word it is munfasil.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'كم حركة يُمدّ المتصل والمنفصل عند حفص من طريق الشاطبية؟',
        en: 'How many counts do muttasil and munfasil take for Hafs via the Shatibiyyah?',
      },
      options: [
        { ar: 'حركتان فقط', en: 'Only 2 counts' },
        { ar: 'أربع أو خمس حركات', en: '4 or 5 counts' },
        { ar: 'ست حركات دائمًا', en: 'Always 6 counts' },
        { ar: 'حركة واحدة', en: '1 count' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'كلاهما يُمدّ أربع أو خمس حركات، بشرط الالتزام بمقدار واحد طوال القراءة.',
        en: 'Both are lengthened 4 or 5 counts, as long as one length is kept the same throughout the recitation.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'لماذا سُمّي المدّ الجائز منفصلًا؟',
        en: 'Why is madd jaiz called munfasil (separated)?',
      },
      options: [
        { ar: 'لأنه غير موجود في المصحف', en: 'Because it does not appear in the mushaf' },
        {
          ar: 'لأن حرف المدّ والهمزة يقعان في كلمتين منفصلتين، لا في كلمة واحدة',
          en: 'Because the madd letter and the hamza fall in two separate words, not one',
        },
        { ar: 'لأنه يُقرأ منفصلًا عن بقية الآية', en: 'Because it is recited apart from the rest of the ayah' },
        { ar: 'لأنه أقصر من المدّ الطبيعي', en: 'Because it is shorter than natural madd' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الانفصال هنا انفصال الكلمتين: حرف المدّ في آخر كلمة، والهمزة في أول الكلمة التالية.',
        en: 'The "separation" is between the two words: the madd letter ends one word, and the hamza starts the next.',
      },
    },
  ],
  reviewed: false,
}
