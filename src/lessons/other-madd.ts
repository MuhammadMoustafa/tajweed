import type { Lesson } from './types'

// How the Quran Foundation API tags these kinds (checked over all 6,236 verses): ʿarid lis-sukun
// and leen are `madda_permissible`, on the madd/leen letter of an ayah's last word only (the
// source assumes a stop at every ayah end); silah sughra is `madda_normal` and silah kubra
// `madda_obligatory` on the small waw/ya (untagged at an ayah's end, where stopping drops it);
// badal and ʿiwad are never tagged, and no custom rule id exists for them, so notes point at them.
export const maddWhenStopping: Lesson = {
  id: 'other-madd',
  order: 6.3,
  unit: 'madd',
  title: {
    ar: 'المدّ عند الوقف: العارض للسكون واللين والعوض',
    en: 'Madd when stopping: ʿarid lis-sukun, leen and ʿiwad',
  },
  summary: {
    ar: 'ثلاثة مدود لا تظهر إلا عند الوقف على الكلمة: العارض للسكون، واللين، والعوض.',
    en: 'Three madds that only appear when you stop on a word: ʿarid lis-sukun, leen and ʿiwad.',
  },
  sections: [
    {
      body: {
        ar: 'تعلّمتَ أن المدّ الطبيعي حركتان، وأن الهمزة أو السكون بعد حرف المدّ يطيلانه. في هذا الدرس ثلاثة مدود لا تكون إلا عند الوقف على الكلمة: لكلٍّ منها سبب تتعرّف عليه أولًا، ثم مقدار تعدّه مع المقطع. وفي الأمثلة تدلّك الألوان على ما تلوّنه المصادر منها، وتدلّك الملاحظات على ما لا تلوّنه.',
        en: 'You have learned that natural madd is 2 counts, and that a hamza or a sukun after a madd letter makes it longer. This lesson covers three madds that only happen when you stop on a word: for each one, first spot its cause, then count its length along with the clip. In the examples, color shows the ones our source marks, and the notes point out the ones it leaves uncolored.',
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
      heading: { ar: '٣. مدّ العوض', en: '3. Madd al-ʿiwad' },
      body: {
        ar: 'إذا وقفتَ على كلمة آخرها تنوين فتح، حذفتَ التنوين ونطقتَ مكانه ألفًا تمدّها حركتين، ولذلك سُمّي مدّ العوض: الألف عوض عن التنوين. وفي المصحف تُكتب بعد تنوين الفتح في الغالب ألف لا تُنطق في الوصل، إذ يُنطق التنوين حينئذ نونًا ساكنة. ويُستثنى ما آخره تاء مربوطة، فيُوقف عليه بهاء ساكنة بلا ألف. لا تلوّنه المصادر، فانظر إلى آخر الآية إذا خُتمت بتنوين فتح.',
        en: 'When you stop on a word ending in tanween fath, drop the tanween and read an alif in its place, held 2 counts. It is called madd al-ʿiwad ("compensation") because the alif makes up for the dropped tanween. In the mushaf, tanween fath is usually followed by a written alif; while you read on, that alif is silent and the tanween sounds as a sakin noon. A word ending in ta marbutah is the exception: you stop on it with a sakin ha and no alif. Our source does not color it, so look at the last word of an ayah that ends in tanween fath.',
      },
      animation: 'madd-iwad',
    },
    {
      heading: { ar: 'الخلاصة', en: 'In short' },
      body: {
        ar: 'عند الوقف يسكن آخر الكلمة، فيجوز مدّ العارض للسكون واللين حركتين أو أربعًا أو ستًّا، ونلتزم الوجه الذي اخترناه في القراءة كلّها؛ وإذا وقفتَ على تنوين الفتح قرأتَ ألفًا حركتين، وهو مدّ العوض.',
        en: 'When you stop, the last letter of the word becomes sakin, so ʿarid lis-sukun and leen may be held 2, 4 or 6 counts, and you keep the length you chose for your whole recitation; stopping on tanween fath, you read an alif for 2 counts: madd al-ʿiwad.',
      },
    },
  ],
  // What the API tags for these kinds (see the comment above): ʿarid and leen as permissible; the natural madd shown beside them.
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
        ar: 'الياء الملوّنة في الكلمة الأخيرة حرف لين، ساكنة بعد فتحة، والوقف يُسكّن الحرف الذي بعدها، فيجوز مدّها حركتين أو أربعًا أو ستًّا. والألف الصغيرة في الكلمة الأولى مدّ طبيعي.',
        en: 'The colored ya in the last word is a leen letter, sakin after a fatha. Stopping makes the letter after it sakin, so it may be held 2, 4 or 6 counts. The small alif in the first word is a natural madd.',
      },
    },
    {
      verseKey: '106:4',
      note: {
        ar: 'الواو الملوّنة في الكلمة الأخيرة حرف لين يُمدّ عند الوقف حركتين أو أربعًا أو ستًّا. أما الياء الملوّنة في الكلمة الأولى فمدّ منفصل (درس سابق).',
        en: 'The colored waw in the last word is a leen letter, held 2, 4 or 6 counts when you stop. The colored ya in the first word is a munfasil madd (an earlier lesson).',
      },
    },
    {
      verseKey: '78:6',
      note: {
        ar: 'الكلمة الأخيرة آخرها تنوين فتح بعده ألف: إذا وقفتَ عليها حذفتَ التنوين وقرأتَ الألف حركتين، وهو مدّ العوض، ولا تلوّنه المصادر. والألف الصغيرة الملوّنة في الكلمة نفسها مدّ طبيعي.',
        en: 'The last word ends in tanween fath followed by an alif: when you stop on it, drop the tanween and read the alif for 2 counts. That is madd al-ʿiwad, left uncolored by our source. The small colored alif in the same word is a natural madd.',
      },
    },
  ],
  // ʿiwad is in neither poem; the Tuhfa states the ʿarid, the Jazariyya the leen and the permissible lengths.
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
        note: {
          ar: 'يذكر البيت المدّ الذي يعرض سكون ما بعده للوقف فقط، وهو المدّ العارض للسكون.',
          en: 'This line names the madd whose following sukun comes only from stopping: madd ʿarid lis-sukun.',
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
  ],
  reviewed: false,
}
