import type { Lesson } from './types'

/** Hafs ʿan ʿAsim by the route of ash-Shatibiyyah: three places read two ways (L23). */
export const hafsTwoWays: Lesson = {
  id: 'hafs-two-ways',
  order: 11.3,
  unit: 'hafs-special',
  title: { ar: 'مواضع لها وجهان', en: 'Places with two ways' },
  summary: {
    ar: 'كلمات يجوز لحفص فيها وجهان صحيحان: عند البدء، وفي الحركة، وعند الوقف.',
    en: 'Words where Hafs has two correct ways: when starting, in a vowel, and when stopping.',
  },
  sections: [
    {
      heading: { ar: 'البدء بكلمة الحجرات ١١', en: 'Starting at the word in al-Hujurat 11' },
      body: {
        ar: 'في هذه الكلمة همزتا وصل: همزة لام التعريف، وهمزة الكلمة نفسها بعد اللام. لا تُنطق أيٌّ منهما عند الوصل بما قبلها، وتُكسر اللام لالتقاء الساكنين. فإن ابتدأتَ بها فلك وجهان: تبدأ بهمزة مفتوحة ثم اللام المكسورة، وهو المقدَّم، أو تبدأ باللام المكسورة مباشرة.',
        en: 'This word has two wasl hamzas: the one of the article al-, and the word’s own one after the lam. Neither is said when you join the word to what comes before, and the lam takes a kasra because two sukuns meet. If you start at this word you have two ways: begin with a hamza on a fatha and then the lam with its kasra (the preferred way), or begin straight on the lam with its kasra.',
      },
      animation: 'hafs-ism',
    },
    {
      heading: { ar: 'الضاد في الروم ٥٤', en: 'The dad in ar-Rum 54' },
      body: {
        ar: 'تتكرر في الآية كلمة واحدة ثلاث مرات، ولحفص في ضادها الفتح والضم. والفتح هو المكتوب في المصحف وهو المقدَّم في الأداء.',
        en: 'One word comes three times in this ayah, and Hafs may read its dad with a fatha or a damma. The fatha is what the mushaf prints and is read first.',
      },
    },
    {
      heading: { ar: 'الياء في النمل ٣٦', en: 'The ya in an-Naml 36' },
      body: {
        ar: 'في هذه الكلمة ياء صغيرة: عند الوصل تُقرأ ياءً مفتوحة. وإن وقفتَ عليها (اضطرارًا أو اختبارًا، فالمعنى لم يتمّ) فلحفص وجهان: إثبات الياء ساكنة، أو حذفها والوقف على النون ساكنة.',
        en: 'This word ends in a small ya: when reading on, it is a ya with a fatha. If you stop on it (only out of need or for testing, since the meaning is not complete) Hafs has two ways: keep the ya, sakin, or drop it and stop on the noon with a sukun.',
      },
    },
  ],
  animation: 'hafs-ism',
  focusRules: ['hafs_special'],
  examples: [
    {
      verseKey: '49:11',
      note: {
        ar: 'اللام الملوّنة في الكلمة الثلاثين مكسورة: عند الوصل تتصل بما قبلها مباشرة، وعند البدء بالكلمة وجهان.',
        en: 'The colored lam in the thirtieth word has a kasra: reading on, it follows the word before directly; starting at this word, there are two ways.',
      },
      marks: [{ word: 30, letter: 2, rule: 'hafs_special' }],
    },
    {
      verseKey: '30:54',
      note: {
        ar: 'الضادات الثلاث الملوّنة: تُقرأ بالفتح كما كُتبت، ويجوز لحفص ضمّها.',
        en: 'The three colored dads: read with a fatha as printed, and Hafs may also read them with a damma.',
      },
      // The API's ikhfa tags on the noon before two of the dads run over the dad itself.
      marks: [
        { word: 6, letter: 1, rule: 'hafs_special', override: true },
        { word: 11, letter: 1, rule: 'hafs_special' },
        { word: 18, letter: 1, rule: 'hafs_special', override: true },
      ],
    },
    {
      verseKey: '27:36',
      note: {
        ar: 'الياء الصغيرة الملوّنة في آخر الكلمة الثامنة: مفتوحة عند الوصل، ولحفص عند الوقف إثباتها ساكنة أو حذفها.',
        en: 'The colored small ya at the end of the eighth word: it has a fatha when reading on; stopping there, Hafs may keep it sakin or drop it.',
      },
      // The API tags the small ya itself (as a madd); here it is the point of the lesson.
      marks: [{ word: 8, letter: 6, rule: 'hafs_special', override: true }],
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 102,
        to: 103,
        note: {
          ar: 'همزة الوصل في الأسماء مكسورة إلا مع لام التعريف فهي مفتوحة (١٠٢)، والكلمة الملوّنة في الحجرات ١١ من الأسماء المذكورة في البيت (١٠٣). لذلك إذا بدأتَ بها بالهمزة فهي همزة لام التعريف المفتوحة، أما همزة الكلمة نفسها فلا تُنطق لأن اللام قبلها.',
          en: 'A wasl hamza in a noun takes a kasra, except with the article al-, where it takes a fatha (102); the colored word of al-Hujurat 11 is one of the nouns the next line lists (103). So when you start that word with a hamza, it is the fatha hamza of al-; the word’s own hamza is never said, since the lam comes before it.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: {
        ar: 'بدأتَ القراءة بالكلمة الملوّنة في الحجرات ١١. أي الأوجه صحيح؟',
        en: 'You start reading at the colored word in al-Hujurat 11. Which is correct?',
      },
      options: [
        { ar: 'همزة مفتوحة ثم لام مكسورة، أو لام مكسورة مباشرة', en: 'A fatha hamza then a kasra lam, or the kasra lam straight away' },
        { ar: 'همزة مكسورة ثم لام ساكنة', en: 'A kasra hamza then a sakin lam' },
        { ar: 'لام ساكنة مباشرة', en: 'A sakin lam straight away' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'لحفص وجهان عند البدء: بالهمزة المفتوحة ثم اللام المكسورة (المقدَّم)، أو باللام المكسورة مباشرة.',
        en: 'Hafs has two ways when starting: a fatha hamza then the kasra lam (preferred), or the kasra lam straight away.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'كيف يقرأ حفص الضاد في الروم ٥٤؟', en: 'How does Hafs read the dad in ar-Rum 54?' },
      options: [
        { ar: 'بالفتح فقط', en: 'With a fatha only' },
        { ar: 'بالضم فقط', en: 'With a damma only' },
        { ar: 'بالفتح والضم، والفتح مقدَّم', en: 'With a fatha or a damma, fatha first' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'لحفص فيها الوجهان، والفتح هو المكتوب والمقدَّم.',
        en: 'Hafs has both; the fatha is the one printed and read first.',
      },
    },
  ],
  reviewed: false,
}
