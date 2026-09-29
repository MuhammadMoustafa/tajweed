import type { Lesson } from './types'

export const idghamNaqis: Lesson = {
  id: 'idgham-complete-incomplete',
  order: 12.2,
  unit: 'finer-levels',
  title: { ar: 'الإدغام الكامل والإدغام الناقص', en: 'Complete and incomplete idgham' },
  summary: {
    ar: 'في الإدغام الكامل لا يبقى شيء من الحرف الأول، وفي الناقص تبقى صفته: الغنة أو الإطباق.',
    en: 'In complete idgham nothing of the first letter remains; in incomplete idgham one quality stays: the ghunnah or the itbaq.',
  },
  sections: [
    {
      body: {
        ar: 'في درس «الإدغام» عرفتَ أن النون الساكنة والتنوين يدخلان في حرف بعدهما. هنا نسأل: هل يذهب الحرف الأول كله أم يبقى منه أثر؟ إن ذهب كله فالإدغام كامل، وإن بقيت صفة منه فالإدغام ناقص. اضغط زر التشغيل لترى الحالات الثلاث.',
        en: 'In the lesson "Idgham" you learned that noon sakinah and tanween enter the letter after them. Here we ask: does the first letter vanish entirely, or does something of it stay? If all of it goes, the idgham is complete; if a quality stays, it is incomplete. Press play to see the three cases.',
      },
      animation: 'idgham-naqis',
    },
    {
      heading: { ar: 'الناقص: النون في الياء والواو', en: 'Incomplete: noon into ya and waw' },
      body: {
        ar: 'إذا أُدغمت النون الساكنة أو التنوين في الياء أو الواو ذهب لفظ النون وبقيت الغنة، فالإدغام ناقص. مقدار الغنة حركتان. وقد مرّت حروف الإدغام بغنة في الدرس السابق.',
        en: 'When a noon sakinah or tanween is merged into ya or waw, the sound of the noon goes but the ghunnah stays, so the idgham is incomplete. The ghunnah lasts two counts. The letters of idgham with ghunnah were covered in the earlier lesson.',
      },
    },
    {
      heading: { ar: 'الناقص: الطاء في التاء', en: 'Incomplete: ṭa into ta' },
      body: {
        ar: 'وكذلك الطاء الساكنة إذا جاءت بعدها تاء: تدخل الطاء في التاء لكن يبقى إطباقها، أي يظل اللسان مطبَقًا على الحنك لحظة، وهو صفة الطاء التي لا تذهب. وقد ذكر ابن الجزري ذلك في وجوب إبانة الإطباق.',
        en: 'In the same way a sakin ṭa followed by a ta: the ṭa enters the ta but its itbaq stays, meaning the tongue stays closed on the palate for a moment, the quality of the ṭa that does not go. Ibn al-Jazari points to this in his instruction to keep the itbaq clear.',
      },
    },
    {
      heading: { ar: 'الكامل: النون في اللام والراء', en: 'Complete: noon into lam and ra' },
      body: {
        ar: 'أما النون الساكنة والتنوين إذا جاء بعدهما لام أو راء فيذهب لفظ النون وصفته كلها، فلا غنة ولا أثر، ويُنطق حرف واحد مشدد. ومثله إدغام النون في النون والميم، إلا أن الغنة هناك من الحرف المدغَم فيه نفسه.',
        en: 'When a noon sakinah or tanween is followed by lam or ra, both its sound and its quality go: no ghunnah and no trace, and one doubled letter is heard. Noon into noon or meem is complete too, except that the ghunnah there belongs to the letter it enters.',
      },
    },
  ],
  focusRules: ['idgham_ghunnah', 'idgham_wo_ghunnah', 'tafkheem'],
  examples: [
    {
      verseKey: '99:7',
      note: {
        ar: 'إدغام ناقص: النون الساكنة ثم الياء، والتنوين ثم الياء، تبقى الغنة في الموضعين.',
        en: 'Incomplete: a noon sakinah then ya, and a tanween then ya; the ghunnah stays in both.',
      },
    },
    {
      verseKey: '104:2',
      note: {
        ar: 'إدغام ناقص في الواو: التنوين في آخر الكلمة الثالثة ثم واو في أول الكلمة بعدها.',
        en: 'Incomplete into waw: the tanween ends the third word and a waw starts the next.',
      },
    },
    {
      verseKey: '100:11',
      note: {
        ar: 'إدغام كامل في اللام: تنوين في آخر الكلمة الرابعة، ولا غنة.',
        en: 'Complete into lam: a tanween ending the fourth word, with no ghunnah.',
      },
    },
    {
      verseKey: '81:25',
      note: {
        ar: 'إدغام كامل في الراء: تنوين في آخر الكلمة الرابعة، ولا غنة.',
        en: 'Complete into ra: a tanween ending the fourth word, with no ghunnah.',
      },
    },
    {
      verseKey: '27:22',
      note: {
        ar: 'إدغام ناقص للطاء في التاء: الطاء الملوّنة بالأزرق في الكلمة الخامسة، وبعدها التاء، ويبقى إطباق الطاء. (الأخضر في هذه الآية إدغام بغنة تعلمته.)',
        en: 'Incomplete idgham of ṭa into ta: the ṭa colored blue in the fifth word, with the ta right after it; the ṭa keeps its itbaq. (The green here is idgham with ghunnah, already learned.)',
      },
      marks: [{ word: 5, letter: 3, rule: 'tafkheem' }],
    },
    {
      verseKey: '5:28',
      note: {
        ar: 'مثال ثانٍ للطاء والتاء: الطاء الملوّنة بالأزرق في الكلمة الثانية، ويبقى إطباقها.',
        en: 'A second ṭa and ta: the ṭa colored blue in the second word keeps its itbaq.',
      },
      marks: [{ word: 2, letter: 3, rule: 'tafkheem' }],
    },
  ],
  mutoon: {
    tuhfa: [
      {
        from: 9,
        to: 12,
        note: {
          ar: 'الإدغام قسمان: بغنة (ي ن م و) وبغير غنة (في اللام والراء). هذا هو الفرق بين الناقص والكامل في النون، وإن لم يذكر النظم اسميهما.',
          en: 'Idgham is of two kinds: with ghunnah (ي ن م و) and without (into lam and ra). This is the difference between incomplete and complete for the noon, although the poem does not use those two names.',
        },
      },
    ],
    jazariyya: [
      {
        from: 46,
        note: {
          ar: 'إبانة الإطباق في كلمتين تأتي فيهما التاء بعد الطاء: يبقى الإطباق مع الإدغام الناقص.',
          en: 'Keeping the itbaq clear in two words where a ta follows the ṭa: the itbaq stays with the incomplete merging.',
        },
      },
      {
        from: 66,
        to: 67,
        note: {
          ar: 'الإدغام في اللام والراء بلا غنة (كامل)، وبغنة في الحروف الأربعة (ناقص)، إلا في كلمة واحدة.',
          en: 'Idgham into lam and ra without ghunnah (complete), and with ghunnah into the four letters (incomplete), except within one word.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يبقى في إدغام النون في الياء؟', en: 'What stays when a noon merges into ya?' },
      options: [
        { ar: 'الغنة', en: 'The ghunnah' },
        { ar: 'الإطباق', en: 'The itbaq' },
        { ar: 'القلقلة', en: 'The qalqalah' },
        { ar: 'لا شيء', en: 'Nothing' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'تبقى الغنة، فالإدغام ناقص.',
        en: 'The ghunnah stays, so the idgham is incomplete.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي إدغام كامل؟', en: 'Which idgham is complete?' },
      options: [
        { ar: 'النون في اللام', en: 'Noon into lam' },
        { ar: 'النون في الواو', en: 'Noon into waw' },
        { ar: 'النون في الياء', en: 'Noon into ya' },
        { ar: 'الطاء في التاء', en: 'Ṭa into ta' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'في اللام والراء يذهب النون بغنته كله.',
        en: 'Into lam and ra the noon goes completely, with its ghunnah.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يبقى في إدغام الطاء في التاء؟', en: 'What stays when ṭa merges into ta?' },
      options: [
        { ar: 'الإطباق', en: 'The itbaq' },
        { ar: 'الغنة', en: 'The ghunnah' },
        { ar: 'المد', en: 'The madd' },
        { ar: 'لا شيء', en: 'Nothing' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'يبقى إطباق الطاء.',
        en: 'The ṭa keeps its itbaq.',
      },
    },
  ],
  reviewed: false,
}
