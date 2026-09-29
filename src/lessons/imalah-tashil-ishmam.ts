import type { Lesson } from './types'

/** Hafs ʿan ʿAsim by the route of ash-Shatibiyyah: his one imalah, one tas-hil and one ishmam (L23). */
export const imalahTashilIshmam: Lesson = {
  id: 'imalah-tashil-ishmam',
  order: 11.1,
  unit: 'hafs-special',
  title: { ar: 'الإمالة والتسهيل والإشمام', en: 'Imalah, tas-hil and ishmam' },
  summary: {
    ar: 'ثلاث كلمات يقرؤها حفص بطريقة خاصة، لكل منها علامة صغيرة في المصحف.',
    en: 'Three words Hafs reads in a special way, each with its own small sign in the mushaf.',
  },
  sections: [
    {
      heading: { ar: 'الإمالة (هود ٤١)', en: 'Imalah (Hud 41)' },
      body: {
        ar: 'الإمالة: أن تميل بالفتحة نحو الكسرة وبالألف نحو الياء، فيخرج صوت بين الفتح والكسر. ولا يُميل حفص إلا في هذا الموضع، على الراء الملوّنة، وعلامتها معيَّن صغير تحتها. وتُرقَّق الراء عندئذ.',
        en: 'Imalah means leaning the fatha toward a kasra and the alif toward a ya, so the vowel comes out between "a" and "i". Hafs does this in this one place only, on the colored ra, marked by a small diamond under it. The ra is then read light.',
      },
      animation: 'hafs-imalah',
    },
    {
      heading: { ar: 'التسهيل (فصلت ٤٤)', en: 'Tas-hil (Fussilat 44)' },
      body: {
        ar: 'في هذه الكلمة همزتان متتاليتان: تُنطق الأولى محقَّقة، وتُسهَّل الثانية: تُنطق بين الهمزة والألف، بلا نبرة الهمزة ولا مدّ الألف. وعلامتها نقطة مطموسة (دائرة ممتلئة) في موضعها.',
        en: 'This word has two hamzas in a row: the first is said in full, the second is eased — said between a hamza and an alif, without the hamza’s catch and without stretching it into an alif. Its sign is a small filled dot in its place.',
      },
      animation: 'hafs-tashil',
    },
    {
      heading: { ar: 'الإشمام والروم (يوسف ١١)', en: 'Ishmam and rawm (Yusuf 11)' },
      body: {
        ar: 'أصل الكلمة نونان: الأولى مضمومة والثانية مفتوحة. ولحفص فيها وجهان: الإشمام، وهو الأشهر: تُدغم النون الأولى في الثانية إدغامًا تامًّا مع ضمّ الشفتين عند النطق بها إشارةً إلى الضمة، ولا يُسمع لذلك صوت. والروم: تُنطق النون الأولى بضمة مختلَسة (بعض الحركة بصوت خفيّ) فلا يتمّ الإدغام. وعلامته معيَّن صغير قبل النون.',
        en: 'The word is built on two noons: the first with a damma, the second with a fatha. Hafs has two ways here. Ishmam, the more common: merge the first noon fully into the second, rounding your lips as you say it to point at the lost damma — the rounding is seen, not heard. Rawm: say the first noon with a quick, partial damma (part of the vowel, softly), so the merge is not complete. Its sign is a small diamond before the noon.',
      },
      animation: 'hafs-ishmam',
    },
  ],
  animation: 'hafs-imalah',
  focusRules: ['hafs_special'],
  examples: [
    {
      verseKey: '11:41',
      note: {
        ar: 'الإمالة على الراء الملوّنة في الكلمة السابعة (بعد علامة الحزب)، والوحيدة في رواية حفص.',
        en: 'The imalah is on the colored ra in the seventh word (counting the hizb sign), the only one in the Hafs reading.',
      },
      marks: [{ word: 7, letter: 3, rule: 'hafs_special' }],
    },
    {
      verseKey: '41:44',
      note: {
        ar: 'الهمزة الثانية ملوّنة: تُسهَّل بين الهمزة والألف، والأولى قبلها تُنطق محقَّقة.',
        en: 'The second hamza is colored: ease it between a hamza and an alif; the first hamza before it is said in full.',
      },
      marks: [{ word: 9, letter: 2, rule: 'hafs_special' }],
    },
    {
      verseKey: '12:11',
      note: {
        ar: 'العلامة على الحرف الملوّن في الكلمة السادسة، وبعده النون المشدّدة التي يكون فيها الإشمام أو الروم.',
        en: 'The sign sits on the colored letter in the sixth word; right after it comes the doubled noon, read with ishmam or rawm.',
      },
      marks: [{ word: 6, letter: 3, rule: 'hafs_special' }],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 104,
        to: 105,
        note: {
          ar: 'يعرّف الناظم الرَّوم (النطق ببعض الحركة) والإشمام (الإشارة إلى الضمة بالشفتين) في باب الوقف على أواخر الكلم. وهما الوجهان نفساهما في كلمة يوسف ١١، لكنهما هناك في وسط الكلمة عند الوصل.',
          en: 'In the chapter on stopping at word ends, the poet defines rawm (saying part of the vowel) and ishmam (pointing at a damma with the lips). They are the same two ways Hafs uses in Yusuf 11, though there they come in the middle of a word, while reading on.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ما الإمالة؟', en: 'What is imalah?' },
      options: [
        { ar: 'الميل بالفتحة نحو الكسرة وبالألف نحو الياء', en: 'Leaning the fatha toward a kasra and the alif toward a ya' },
        { ar: 'ضمّ الشفتين بلا صوت', en: 'Rounding the lips without a sound' },
        { ar: 'قطع الصوت بلا تنفّس', en: 'Cutting the sound without a breath' },
        { ar: 'نطق الهمزة بين الهمزة والألف', en: 'Saying a hamza between a hamza and an alif' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'الإمالة ميل الفتحة نحو الكسرة والألف نحو الياء، ولا يُميل حفص إلا في هود ٤١.',
        en: 'Imalah leans the fatha toward a kasra and the alif toward a ya; Hafs does it only in Hud 41.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كيف تُقرأ الهمزة الثانية في فصلت ٤٤؟', en: 'How is the second hamza in Fussilat 44 read?' },
      options: [
        { ar: 'محقَّقة كالأولى', en: 'In full, like the first' },
        { ar: 'مسهَّلة بين الهمزة والألف', en: 'Eased, between a hamza and an alif' },
        { ar: 'تُحذف تمامًا', en: 'Dropped completely' },
        { ar: 'تُمدّ ست حركات', en: 'Stretched for six counts' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'تُسهَّل الثانية بين الهمزة والألف، وتبقى الأولى محقَّقة.',
        en: 'The second is eased between a hamza and an alif; the first stays in full.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الإشمام في يوسف ١١؟', en: 'What is the ishmam in Yusuf 11?' },
      options: [
        { ar: 'نطق بعض الضمة بصوت خفيّ', en: 'Saying part of the damma softly' },
        { ar: 'ضمّ الشفتين مع إدغام النون الأولى في الثانية، بلا صوت', en: 'Rounding the lips while merging the first noon into the second, with no sound' },
        { ar: 'إظهار النونين بلا غنّة', en: 'Saying both noons clearly, with no ghunnah' },
        { ar: 'الوقف على النون', en: 'Stopping on the noon' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الإشمام ضمّ الشفتين إشارةً إلى الضمة مع الإدغام التام، ولا يُسمع. أما نطق بعض الضمة فهو الرَّوم، الوجه الآخر.',
        en: 'Ishmam is rounding the lips toward the damma while fully merging, and it is not heard. Saying part of the damma is rawm, the other way.',
      },
    },
    {
      kind: 'tap',
      prompt: { ar: 'اضغط على الحرف الذي فيه الإمالة.', en: 'Tap the letter read with imalah.' },
      verseKey: '11:41',
      rule: 'hafs_special',
      marks: [{ word: 7, letter: 3, rule: 'hafs_special' }],
    },
  ],
  reviewed: false,
}
