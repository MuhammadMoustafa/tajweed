import type { Lesson } from './types'

// How the Quran Foundation API tags these kinds (checked over all 6,236 verses): silah sughra is
// `madda_normal` and silah kubra `madda_obligatory` on the small waw/ya (untagged at an ayah's end,
// where stopping drops it); badal is never tagged, and no custom rule id exists for it, so notes point at it.
export const maddBadalSilah: Lesson = {
  id: 'badal-silah',
  order: 6.4,
  unit: 'madd',
  title: {
    ar: 'مدّ البدل والصلة',
    en: 'Madd al-badal and madd al-silah',
  },
  summary: {
    ar: 'مدّان سببهما الهمزة قبل حرف المدّ أو هاء الضمير: البدل والصلة.',
    en: 'Two madds that come from a hamza before the madd letter or from the pronoun ha: badal and silah.',
  },
  sections: [
    {
      body: {
        ar: 'تعلّمتَ أن المدّ الطبيعي حركتان، وأن الهمزة بعد حرف المدّ تطيله. في هذا الدرس مدّان آخران: البدل، حين تتقدّم الهمزة على حرف المدّ، والصلة، حين يقع حرف مدّ بعد هاء الضمير. لكلٍّ منهما سبب تتعرّف عليه أولًا، ثم مقدار تعدّه مع المقطع. وفي الأمثلة تدلّك الألوان على ما تلوّنه المصادر منهما، وتدلّك الملاحظات على ما لا تلوّنه.',
        en: 'You have learned that natural madd is 2 counts, and that a hamza after a madd letter makes it longer. This lesson covers two more madds: badal, when the hamza comes before the madd letter, and silah, when a madd letter follows the pronoun ha. For each one, first spot its cause, then count its length along with the clip. In the examples, color shows the ones our source marks, and the notes point out the ones it leaves uncolored.',
      },
    },
    {
      heading: { ar: '١. مدّ البدل', en: '1. Madd al-badal' },
      body: {
        ar: 'إذا تقدّمت الهمزة على حرف المدّ، وليس بعده همزة ولا سكون، فهو مدّ البدل. سُمّي بذلك لأن حرف المدّ فيه في الغالب مُبدَل من همزة ثانية ساكنة. ومقداره في رواية حفص حركتان فقط كالمدّ الطبيعي، وإنما عدّه ناظم التحفة من المدّ الجائز لأن بعض القرّاء، كورش، يمدّونه أكثر من ذلك. لا تلوّنه المصادر، فابحث عن همزة قبل حرف المدّ مباشرة.',
        en: 'When a hamza comes before a madd letter, with no hamza or sukun after it, the madd is madd al-badal. It is named "substitution" because its madd letter usually stands in for a second, sakin hamza. In Hafs it is only 2 counts, like natural madd; the Tuhfa lists it among the permissible madds because some readers, such as Warsh, stretch it longer. Our source does not color it, so look for a hamza right before the madd letter.',
      },
      animation: 'madd-badal',
    },
    {
      heading: { ar: '٢. مدّ الصلة', en: '2. Madd al-silah' },
      body: {
        ar: 'هاء الضمير هي الهاء الزائدة الدالّة على المفرد المذكّر الغائب. إذا وقعت بين حرفين متحرّكين، وُصلت حركتها بحرف مدّ: الضمّة بواو، والكسرة بياء، وتُكتب في المصحف واوًا صغيرة أو ياءً صغيرة بعد الهاء. فإن لم يكن بعدها همزة فهي الصلة الصغرى، حركتان كالمدّ الطبيعي. وإن كان بعدها همزة فهي الصلة الكبرى، تُمدّ كالمنفصل أربع حركات أو خمسًا. ولا صلة إذا وقفتَ على الهاء، ولا إذا كان قبلها أو بعدها ساكن، إلا مواضع قرأها حفص على خلاف ذلك، كالهاء التي وُصلت مع سكون ما قبلها في سورة الفرقان (٢٥:٦٩)، والتي لم توصل مع تحرّك ما حولها في سورة الزمر (٣٩:٧). وتلوّن المصادر الصغرى بلون المدّ الطبيعي، والكبرى بلون المدّ المتصل والمنفصل.',
        en: 'The pronoun ha is the ha added to a word to mean "him", "his" or "it". When it sits between two moving letters (the letter before it and the one after it both carry a harakah), its vowel is drawn out into a madd letter: a damma into a waw, a kasra into a ya, written in the mushaf as a small waw or small ya after the ha. If the next letter is not a hamza, this is silah sughra: 2 counts, like natural madd. If the next letter is a hamza, it is silah kubra, stretched like munfasil: 4 or 5 counts. There is no silah when you stop on the ha, or when the letter before or after it is sakin, apart from a few places Hafs reads differently, such as the ha lengthened after a sakin letter in Al-Furqan (25:69) and the one read short between moving letters in Az-Zumar (39:7). Our source colors sughra like natural madd, and kubra like muttasil and munfasil.',
      },
      animation: 'madd-silah',
    },
    {
      heading: { ar: 'الخلاصة', en: 'In short' },
      body: {
        ar: 'إذا سبقت الهمزة حرف المدّ فهو البدل، وهو حركتان في رواية حفص؛ وهاء الضمير بين متحرّكين تُوصل بواو أو ياء: صلة صغرى حركتين، أو كبرى أربع حركات أو خمسًا إذا جاءت بعدها همزة.',
        en: 'A hamza before the madd letter makes badal, 2 counts in Hafs; a pronoun ha between two moving letters is joined to a waw or ya: silah sughra for 2 counts, or silah kubra for 4 or 5 counts when a hamza follows.',
      },
    },
  ],
  // What the API actually tags for these kinds (see the comment above): silah sughra, silah kubra; the natural madd beside badal.
  focusRules: ['madda_normal', 'madda_obligatory'],
  examples: [
    {
      verseKey: '106:1',
      note: {
        ar: 'في الكلمة الأولى همزة بعدها ياء مدّية: مدّ بدل، حركتان، ولا تلوّنه المصادر؛ والألف الصغيرة بعدها مدّ طبيعي.',
        en: 'In the first word, a hamza followed by a madd ya is madd al-badal, 2 counts, left uncolored by our source; the small alif after it is a natural madd.',
      },
    },
    {
      verseKey: '106:4',
      note: {
        ar: 'في الكلمة الخامسة همزة بعدها ألف: مدّ بدل، حركتان في حفص، ولا تلوّنه المصادر. أما الياء الملوّنة في الكلمة الأولى فمدّ منفصل (درس سابق).',
        en: 'The fifth word has a hamza followed by an alif: madd al-badal, 2 counts in Hafs, left uncolored by our source. The colored ya in the first word is a munfasil madd (an earlier lesson).',
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
  // Silah is in neither poem; the Tuhfa's line 46 states badal.
  mutoon: {
    tuhfa: [
      {
        from: 46,
        note: {
          ar: 'يذكر الشطر الأول من البيت البدل، وهو أن تتقدّم الهمزة على حرف المدّ. والبدل في رواية حفص حركتان فقط، وإنما عُدّ جائزًا لأن غير حفص يمدّه أكثر.',
          en: 'The first half of this line names badal: the hamza comes before the madd letter. In Hafs, badal is still only 2 counts; the poem counts it as permissible because other readers stretch it longer.',
        },
      },
    ],
    jazariyya: 'not-covered',
  },
  quiz: [
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
