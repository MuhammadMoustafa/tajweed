import type { Lesson } from './types'

// How the Quran Foundation API tags these kinds (checked over all 6,236 verses): ʿarid lis-sukun
// and leen are `madda_permissible`, on the madd/leen letter of an ayah's last word only (the
// source assumes a stop at every ayah end); silah sughra is `madda_normal` and silah kubra
// `madda_obligatory` on the small waw/ya (untagged at an ayah's end, where stopping drops it);
// badal and ʿiwad are never tagged, and no custom rule id exists for them, so notes point at them.
export const otherMadd: Lesson = {
  id: 'other-madd',
  order: 6.3,
  unit: 'madd',
  title: {
    ar: 'مدود أخرى: العارض للسكون واللين والبدل والعوض والصلة',
    en: 'Other madd: ʿarid lis-sukun, leen, badal, ʿiwad and silah',
  },
  summary: {
    ar: 'خمسة مدود يكثر ورودها: ثلاثة تظهر عند الوقف (العارض للسكون، واللين، والعوض)، واثنان سببهما الهمزة قبل حرف المدّ أو هاء الضمير (البدل، والصلة).',
    en: 'Five more madds you meet often: three that appear when you stop (ʿarid lis-sukun, leen and ʿiwad), and two that come from a hamza before the madd letter or from the pronoun ha (badal and silah).',
  },
  sections: [
    {
      body: {
        ar: 'تعلّمتَ أن المدّ الطبيعي حركتان، وأن الهمزة أو السكون بعد حرف المدّ يطيلانه. في هذا الدرس خمسة مدود أخرى: لكلٍّ منها سبب تتعرّف عليه أولًا، ثم مقدار تعدّه مع المقطع. ثلاثة منها لا تكون إلا عند الوقف على الكلمة، واثنان يتعلّقان بالهمزة قبل حرف المدّ وبهاء الضمير. وفي الأمثلة تدلّك الألوان على ما تلوّنه المصادر منها، وتدلّك الملاحظات على ما لا تلوّنه.',
        en: 'You have learned that natural madd is 2 counts, and that a hamza or a sukun after a madd letter makes it longer. This lesson covers five more madds: for each one, first spot its cause, then count its length along with the clip. Three of them only happen when you stop on a word; two come from a hamza before the madd letter or from the pronoun ha. In the examples, color shows the ones our source marks, and the notes point out the ones it leaves uncolored.',
      },
    },
    {
      heading: { ar: '١. المدّ العارض للسكون', en: '1. Madd ʿarid lis-sukun' },
      body: {
        ar: 'إذا وقفتَ على كلمة قبل آخرها حرف مدّ، سكن الحرف الأخير لأجل الوقف، فصار بعد حرف المدّ سكون عارض، أي غير أصلي. هذا هو المدّ العارض للسكون، ويجوز فيه ثلاثة أوجه: القصر حركتان، والتوسّط أربع حركات، والطول ستّ حركات. اختر وجهًا واحدًا والتزمه في قراءتك كلّها، فلا تمدّ عند وقفٍ ستًّا وعند الذي يليه حركتين. فإن وصلتَ الكلمة بما بعدها زال السكون، ورجع المدّ طبيعيًا حركتين. تلوّنه المصادر في أواخر الآيات لأنها مواضع الوقف المعتادة، والحكم نفسه في كل موضع تقف فيه.',
        en: 'When you stop on a word whose last letter comes right after a madd letter, that last letter becomes sakin because of the stop. The madd letter is now followed by a sukun that is only temporary (ʿarid). This is madd ʿarid lis-sukun, and it may be read three ways: qasr, 2 counts; tawassut, 4 counts; or tul, 6 counts. Choose one and keep it for your whole recitation: do not stretch 6 counts at one stop and 2 at the next. If you read on into the next word instead, the sukun goes away and the madd is back to a natural 2 counts. Our source colors it at the end of each ayah, the usual place to stop, but the same rule applies wherever you stop.',
      },
      animation: 'madd-arid',
    },
    {
      heading: { ar: '٢. مدّ اللين', en: '2. Madd al-leen' },
      body: {
        ar: 'حرفا اللين هما الواو والياء الساكنتان بعد فتحة. لا مدّ فيهما في الوصل، بل يُنطقان بسهولة ولين من غير إطالة. فإذا وقفتَ على كلمة آخرها بعد حرف لين، سكن الآخر للوقف، فجاز مدّ حرف اللين حركتين أو أربعًا أو ستًّا، كالعارض للسكون. ولا تجعله أطول من المدّ العارض للسكون في قراءتك، لأن حرف المدّ أقوى من حرف اللين. وتلوّنه المصادر بلون العارض للسكون في أواخر الآيات.',
        en: 'The two leen letters are waw and ya sakinah after a fatha. When you read on, they are not stretched at all, just pronounced smoothly and softly. When you stop on a word whose last letter comes right after a leen letter, that letter becomes sakin, and the leen letter may then be stretched 2, 4 or 6 counts, like ʿarid lis-sukun. Never make it longer than your ʿarid lis-sukun length, since a madd letter is stronger than a leen letter. Our source colors it like ʿarid lis-sukun at the ends of ayahs.',
      },
      animation: 'madd-leen',
    },
    {
      heading: { ar: '٣. مدّ البدل', en: '3. Madd al-badal' },
      body: {
        ar: 'إذا تقدّمت الهمزة على حرف المدّ، وليس بعده همزة ولا سكون، فهو مدّ البدل. سُمّي بذلك لأن حرف المدّ فيه في الغالب مُبدَل من همزة ثانية ساكنة. ومقداره في رواية حفص حركتان فقط كالمدّ الطبيعي، وإنما عدّه ناظم التحفة من المدّ الجائز لأن بعض القرّاء، كورش، يمدّونه أكثر من ذلك. لا تلوّنه المصادر، فابحث عن همزة قبل حرف المدّ مباشرة.',
        en: 'When a hamza comes before a madd letter, with no hamza or sukun after it, the madd is madd al-badal. It is named "substitution" because its madd letter usually stands in for a second, sakin hamza. In Hafs it is only 2 counts, like natural madd; the Tuhfa lists it among the permissible madds because some readers, such as Warsh, stretch it longer. Our source does not color it, so look for a hamza right before the madd letter.',
      },
      animation: 'madd-badal',
    },
    {
      heading: { ar: '٤. مدّ العوض', en: '4. Madd al-ʿiwad' },
      body: {
        ar: 'إذا وقفتَ على كلمة آخرها تنوين فتح، حذفتَ التنوين ونطقتَ مكانه ألفًا تمدّها حركتين، ولذلك سُمّي مدّ العوض: الألف عوض عن التنوين. وفي المصحف تُكتب بعد تنوين الفتح في الغالب ألف لا تُنطق في الوصل، إذ يُنطق التنوين حينئذ نونًا ساكنة. ويُستثنى ما آخره تاء مربوطة، فيُوقف عليه بهاء ساكنة بلا ألف. لا تلوّنه المصادر، فانظر إلى آخر الآية إذا خُتمت بتنوين فتح.',
        en: 'When you stop on a word ending in tanween fath, drop the tanween and read an alif in its place, held 2 counts. It is called madd al-ʿiwad ("compensation") because the alif makes up for the dropped tanween. In the mushaf, tanween fath is usually followed by a written alif; while you read on, that alif is silent and the tanween sounds as a sakin noon. A word ending in ta marbutah is the exception: you stop on it with a sakin ha and no alif. Our source does not color it, so look at the last word of an ayah that ends in tanween fath.',
      },
      animation: 'madd-iwad',
    },
    {
      heading: { ar: '٥. مدّ الصلة', en: '5. Madd al-silah' },
      body: {
        ar: 'هاء الضمير هي الهاء الزائدة الدالّة على المفرد المذكّر الغائب. إذا وقعت بين حرفين متحرّكين، وُصلت حركتها بحرف مدّ: الضمّة بواو، والكسرة بياء، وتُكتب في المصحف واوًا صغيرة أو ياءً صغيرة بعد الهاء. فإن لم يكن بعدها همزة فهي الصلة الصغرى، حركتان كالمدّ الطبيعي. وإن كان بعدها همزة فهي الصلة الكبرى، تُمدّ كالمنفصل أربع حركات أو خمسًا. ولا صلة إذا وقفتَ على الهاء، ولا إذا كان قبلها أو بعدها ساكن، إلا مواضع قرأها حفص على خلاف ذلك، كالهاء التي وُصلت مع سكون ما قبلها في سورة الفرقان (٢٥:٦٩)، والتي لم توصل مع تحرّك ما حولها في سورة الزمر (٣٩:٧). وتلوّن المصادر الصغرى بلون المدّ الطبيعي، والكبرى بلون المدّ المتصل والمنفصل.',
        en: 'The pronoun ha is the ha added to a word to mean "him", "his" or "it". When it sits between two moving letters (the letter before it and the one after it both carry a harakah), its vowel is drawn out into a madd letter: a damma into a waw, a kasra into a ya, written in the mushaf as a small waw or small ya after the ha. If the next letter is not a hamza, this is silah sughra: 2 counts, like natural madd. If the next letter is a hamza, it is silah kubra, stretched like munfasil: 4 or 5 counts. There is no silah when you stop on the ha, or when the letter before or after it is sakin, apart from a few places Hafs reads differently, such as the ha lengthened after a sakin letter in Al-Furqan (25:69) and the one read short between moving letters in Az-Zumar (39:7). Our source colors sughra like natural madd, and kubra like muttasil and munfasil.',
      },
      animation: 'madd-silah',
    },
  ],
  // What the API actually tags for these kinds (see the comment above): ʿarid/leen, silah sughra, silah kubra.
  focusRules: ['madda_permissible', 'madda_normal', 'madda_obligatory'],
  examples: [
    {
      verseKey: '1:4',
      note: {
        ar: 'الياء الملوّنة في الكلمة الأخيرة مدّ عارض للسكون: عند الوقف تسكن النون بعدها، فتُمدّ حركتين أو أربعًا أو ستًّا. وفي الكلمة الثانية واو ساكنة بعد فتحة، أي حرف لين، لكنك لا تقف عليها فلا تمدّها. والألف الصغيرة في الكلمة الأولى مدّ طبيعي.',
        en: 'The colored ya in the last word is madd ʿarid lis-sukun: when you stop, the noon after it becomes sakin, so hold it 2, 4 or 6 counts. The second word has a waw sakinah after a fatha, a leen letter, but you read on past it, so it is not stretched. The small alif in the first word is a natural madd.',
      },
    },
    {
      verseKey: '106:1',
      note: {
        ar: 'الياء الملوّنة في الكلمة الأخيرة حرف لين، ساكنة بعد فتحة، والوقف يُسكّن الحرف الذي بعدها، فيجوز مدّها حركتين أو أربعًا أو ستًّا. وفي الكلمة الأولى همزة بعدها ياء مدّية: مدّ بدل، حركتان، ولا تلوّنه المصادر؛ والألف الصغيرة بعدها مدّ طبيعي.',
        en: 'The colored ya in the last word is a leen letter, sakin after a fatha. Stopping makes the letter after it sakin, so it may be held 2, 4 or 6 counts. In the first word, a hamza followed by a madd ya is madd al-badal, 2 counts, left uncolored by our source; the small alif after it is a natural madd.',
      },
    },
    {
      verseKey: '106:4',
      note: {
        ar: 'الواو الملوّنة في الكلمة الأخيرة حرف لين يُمدّ عند الوقف حركتين أو أربعًا أو ستًّا. وفي الكلمة الخامسة همزة بعدها ألف: مدّ بدل، حركتان في حفص، ولا تلوّنه المصادر. أما الياء الملوّنة في الكلمة الأولى فمدّ منفصل (درس سابق).',
        en: 'The colored waw in the last word is a leen letter, held 2, 4 or 6 counts when you stop. The fifth word has a hamza followed by an alif: madd al-badal, 2 counts in Hafs, left uncolored by our source. The colored ya in the first word is a munfasil madd (an earlier lesson).',
      },
    },
    {
      verseKey: '78:6',
      note: {
        ar: 'الكلمة الأخيرة آخرها تنوين فتح بعده ألف: إذا وقفتَ عليها حذفتَ التنوين وقرأتَ الألف حركتين، وهو مدّ العوض، ولا تلوّنه المصادر. والألف الصغيرة الملوّنة في الكلمة نفسها مدّ طبيعي.',
        en: 'The last word ends in tanween fath followed by an alif: when you stop on it, drop the tanween and read the alif for 2 counts. That is madd al-ʿiwad, left uncolored by our source. The small colored alif in the same word is a natural madd.',
      },
    },
    {
      verseKey: '110:3',
      note: {
        ar: 'الواو الصغيرة الملوّنة في الكلمة الخامسة صلة صغرى: هاء الضمير بين متحرّكين، والحرف بعدها ليس همزة، فتُمدّ حركتين. أما الهاء في الكلمة الرابعة فقبلها ساكن، فلا صلة فيها.',
        en: 'The small colored waw in the fifth word is silah sughra: the pronoun ha sits between two moving letters and the next letter is not a hamza, so hold it 2 counts. The ha in the fourth word comes after a sakin letter, so it gets no silah.',
      },
    },
    {
      verseKey: '104:3',
      note: {
        ar: 'الواو الصغيرة الملوّنة في الكلمة الثالثة صلة كبرى: هاء الضمير بين متحرّكين، وأول الكلمة التالية همزة، فتُمدّ كالمنفصل أربع حركات أو خمسًا. أما الهاء في آخر الآية فلا صلة فيها عند الوقف، ولذلك لم تُلوَّن واوها الصغيرة.',
        en: 'The small colored waw in the third word is silah kubra: the pronoun ha sits between two moving letters and the next word starts with a hamza, so hold it like munfasil, 4 or 5 counts. The ha at the end of the ayah gets no silah when you stop there, which is why its small waw is not colored.',
      },
    },
  ],
  // Silah and ʿiwad are in neither poem.
  mutoon: {
    tuhfa: [
      {
        from: 41,
        note: {
          ar: 'يعرّف هذا البيت حرفي اللين: الياء والواو الساكنتين إذا انفتح ما قبلهما.',
          en: 'This line defines the two leen letters: ya and waw sakinah with a fatha before them.',
        },
      },
      {
        from: 45,
        to: 46,
        note: {
          ar: 'يضيف البيتان إلى المنفصل المذكور قبلهما نوعين آخرين من المدّ الجائز: العارض للسكون، إذا كان السكون للوقف فقط، والبدل، إذا تقدّمت الهمزة على حرف المدّ. والبدل في رواية حفص حركتان فقط، وإنما عُدّ جائزًا لأن غير حفص يمدّه أكثر.',
          en: 'These two lines add two more permissible madds to the munfasil of the line before: ʿarid lis-sukun, when the sukun comes only from stopping, and badal, when the hamza comes before the madd letter. In Hafs, badal is still only 2 counts; the poem counts it as permissible because other readers stretch it longer.',
        },
      },
    ],
    jazariyya: [
      {
        from: 24,
        to: 25,
        note: {
          ar: 'من باب الصفات: اللين صفة الواو والياء الساكنتين المفتوح ما قبلهما، ويذكرها البيتان مع صفات أخرى.',
          en: 'From the chapter on the letters’ characteristics: leen is the quality of waw and ya sakinah after a fatha, listed in these two lines among other characteristics.',
        },
      },
      {
        from: 69,
        note: {
          ar: 'يقسم البيت المدّ إلى لازم وواجب وجائز، ويذكر أن الجائز ثبت فيه المدّ والقصر، ومن هنا جاءت الأوجه في العارض للسكون.',
          en: 'This line divides madd into necessary, obligatory and permissible, and says both lengthening and shortening are established for the permissible kind, which is where the choice of lengths in ʿarid lis-sukun comes from.',
        },
      },
      {
        from: 72,
        note: {
          ar: 'يعدّ البيت من الجائز المنفصلَ، والمدَّ الذي عرض سكون ما بعده للوقف، وهو المدّ العارض للسكون.',
          en: 'This line counts as permissible both the munfasil madd and the madd followed by a sukun that comes only from stopping: madd ʿarid lis-sukun.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على حرف المدّ الذي يصير مدًّا عارضًا للسكون عند الوقف على آخر هذه الآية.',
        en: 'Tap the madd letter that becomes madd ʿarid lis-sukun when you stop at the end of this ayah.',
      },
      verseKey: '1:4',
      rule: 'madda_permissible',
    },
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على حرف اللين الذي يُمدّ عند الوقف على آخر هذه الآية.',
        en: 'Tap the leen letter that is stretched when you stop at the end of this ayah.',
      },
      verseKey: '106:1',
      rule: 'madda_permissible',
    },
    {
      kind: 'tap',
      prompt: { ar: 'اضغط على الصلة الصغرى في هذه الآية.', en: 'Tap the silah sughra in this ayah.' },
      verseKey: '110:3',
      rule: 'madda_normal',
    },
    {
      kind: 'tap',
      prompt: { ar: 'اضغط على الصلة الكبرى في هذه الآية.', en: 'Tap the silah kubra in this ayah.' },
      verseKey: '104:3',
      rule: 'madda_obligatory',
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'كم حركة يجوز أن يُمدّ المدّ العارض للسكون؟',
        en: 'How many counts may madd ʿarid lis-sukun be held?',
      },
      options: [
        { ar: 'حركتان فقط', en: 'Only 2' },
        { ar: '٤ أو ٥', en: '4 or 5' },
        { ar: '٢ أو ٤ أو ٦', en: '2, 4 or 6' },
        { ar: '٦ فقط', en: 'Only 6' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'فيه ثلاثة أوجه: القصر (٢)، والتوسّط (٤)، والطول (٦)، يختار القارئ واحدًا منها.',
        en: 'It has three permitted lengths: qasr (2), tawassut (4) and tul (6); the reader chooses one of them.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'مددتَ العارض للسكون أربع حركات عند أول وقف. كم تمدّه عند الوقف التالي؟',
        en: 'You held madd ʿarid lis-sukun for 4 counts at your first stop. How long do you hold it at the next stop?',
      },
      options: [
        { ar: 'حركتين', en: '2 counts' },
        { ar: 'أربع حركات', en: '4 counts' },
        { ar: 'ستّ حركات', en: '6 counts' },
        { ar: 'أيّ مقدار أشاء', en: 'Any length I like' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الوجه الذي تختاره تلتزمه في قراءتك كلّها، فلا تنتقل من مقدار إلى آخر.',
        en: 'Whichever length you choose, you keep it for your whole recitation instead of switching between lengths.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'متى يُمدّ حرف اللين؟', en: 'When is a leen letter stretched?' },
      options: [
        { ar: 'دائمًا، حركتين', en: 'Always, for 2 counts' },
        { ar: 'عند الوقف على كلمة يأتي فيها قبل الحرف الأخير', en: 'When you stop on a word where it comes right before the last letter' },
        { ar: 'إذا جاء بعده همزة في كلمة أخرى', en: 'When a hamza follows it in the next word' },
        { ar: 'لا يُمدّ أبدًا', en: 'Never' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'لا مدّ في حرف اللين عند الوصل؛ فإذا وقفتَ وسكن ما بعده جاز مدّه حركتين أو أربعًا أو ستًّا.',
        en: 'A leen letter is not stretched when you read on; when you stop and the letter after it becomes sakin, it may be held 2, 4 or 6 counts.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كم حركة يُمدّ مدّ البدل في رواية حفص؟', en: 'How many counts is madd al-badal in Hafs?' },
      options: [
        { ar: '٢', en: '2' },
        { ar: '٤', en: '4' },
        { ar: '٥', en: '5' },
        { ar: '٦', en: '6' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'البدل في رواية حفص حركتان فقط كالمدّ الطبيعي.',
        en: 'In Hafs, badal is only 2 counts, like natural madd.',
      },
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'وقفتَ على كلمة آخرها تنوين فتح، وليست تاءً مربوطة. ماذا تقرأ؟',
        en: 'You stop on a word ending in tanween fath, not a ta marbutah. What do you read?',
      },
      options: [
        { ar: 'التنوين نونًا ساكنة', en: 'The tanween, as a sakin noon' },
        { ar: 'ألفًا مكان التنوين، حركتين', en: 'An alif in place of the tanween, for 2 counts' },
        { ar: 'ألفًا ستّ حركات', en: 'An alif for 6 counts' },
        { ar: 'هاءً ساكنة', en: 'A sakin ha' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'هذا مدّ العوض: يُحذف التنوين عند الوقف وتُقرأ الألف عوضًا عنه حركتين.',
        en: 'This is madd al-ʿiwad: the tanween drops when you stop, and the alif is read in its place for 2 counts.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'متى تكون صلة هاء الضمير صلةً كبرى؟', en: 'When is the silah of the pronoun ha a silah kubra?' },
      options: [
        { ar: 'إذا جاء بعد الهاء همزة', en: 'When a hamza comes after the ha' },
        { ar: 'إذا وقفتَ على الهاء', en: 'When you stop on the ha' },
        { ar: 'إذا كان قبل الهاء حرف ساكن', en: 'When the letter before the ha is sakin' },
        { ar: 'إذا كانت الهاء مكسورة', en: 'When the ha has a kasra' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'إذا جاء بعدها همزة فهي صلة كبرى تُمدّ كالمنفصل أربع حركات أو خمسًا؛ وعند الوقف أو مع سكون ما قبلها فلا صلة أصلًا.',
        en: 'With a hamza after it, it is silah kubra, held like munfasil for 4 or 5 counts; when you stop on it, or the letter before it is sakin, there is no silah at all.',
      },
    },
  ],
  reviewed: false,
}
