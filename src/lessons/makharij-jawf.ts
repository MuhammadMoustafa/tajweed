import type { Lesson } from './types'

export const makharijJawf: Lesson = {
  id: 'makharij-jawf',
  order: 2.1,
  unit: 'makharij',
  title: { ar: 'مخارج الحروف: الجوف', en: 'Makharij: al-jawf (the empty space)' },
  summary: {
    ar: 'الجوف مخرج واحد، ومنه حروف المد الثلاثة: الألف والواو والياء.',
    en: 'The jawf is one makhraj: the three madd letters, alif, waw and ya, come from it.',
  },
  sections: [
    {
      body: {
        ar: 'الجوف هو الفراغ داخل الحلق والفم، وهو مخرج واحد تخرج منه حروف المد الثلاثة: الألف الساكنة المفتوح ما قبلها (ولا تكون الألف إلا كذلك)، والواو الساكنة المضموم ما قبلها، والياء الساكنة المكسور ما قبلها.',
        en: 'The jawf is the empty space inside the throat and mouth. It is one makhraj, and the three madd letters come from it: alif, which is always sakinah after a fatha; waw sakinah after a damma; and ya sakinah after a kasra.',
      },
    },
    {
      heading: { ar: 'مخرج مقدَّر', en: 'No fixed spot' },
      body: {
        ar: 'ليس لحروف المد موضع محدد ينقطع عنده الصوت كسائر الحروف، بل يجري الصوت في فراغ الجوف وينتهي بانتهاء الهواء؛ ولذلك يقال إن مخرجها مقدَّر لا محقَّق، وتسمّى الحروف الجوفية أو الهوائية.',
        en: 'Unlike the other letters, the madd letters have no fixed spot where the sound stops: the sound runs through the open jawf and ends when the breath ends. That is why their makhraj is called estimated rather than exact, and why they are called the jawf letters, or the airy letters.',
      },
    },
    {
      heading: { ar: 'الواو والياء غير المديتين', en: 'Waw and ya that are not madd letters' },
      body: {
        ar: 'إذا تحركت الواو أو الياء فليستا من الجوف: الواو المتحركة من الشفتين، والياء المتحركة من وسط اللسان، وستأتيان في فصليهما.',
        en: 'A waw or ya that carries a harakah is not from the jawf: that waw comes from the lips and that ya from the middle of the tongue. Both come again in their own chapters.',
      },
    },
  ],
  animation: 'makharij-jawf',
  // No rule is colored here: the notes point at the madd letters and where they come from.
  focusRules: [],
  examples: [
    {
      verseKey: '114:1',
      note: {
        ar: 'الواو في الكلمة الثانية ساكنة بعد ضم، والألف في الكلمة الأخيرة بعد فتح: كلتاهما حرف مد من الجوف.',
        en: 'The waw in the second word is sakinah after a damma, and the alif in the last word follows a fatha: both are madd letters from the jawf.',
      },
    },
    {
      verseKey: '1:5',
      note: {
        ar: 'الألف بعد الياء المشددة في الكلمة الأولى والثالثة، والياء الساكنة بعد كسر قبل آخر حرف في الكلمة الأخيرة: حروف مد من الجوف. أما الياء المشددة نفسها فمن وسط اللسان.',
        en: 'The alif after the ya with shaddah in the first and third words, and the ya sakinah after a kasra just before the last letter of the last word, are madd letters from the jawf. The ya with shaddah itself comes from the middle of the tongue.',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: [
      {
        from: 10,
        note: {
          ar: 'الألف وأختاها الواو والياء مخرجها الجوف، وهي حروف المد التي تنتهي بانتهاء الهواء.',
          en: 'Alif and its two "sisters", waw and ya, come from the jawf: they are the madd letters, which end when the breath ends.',
        },
      },
    ],
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'كم مخرجًا في الجوف؟', en: 'How many makharij are in the jawf?' },
      options: [
        { ar: 'واحد', en: 'One' },
        { ar: 'اثنان', en: 'Two' },
        { ar: 'ثلاثة', en: 'Three' },
        { ar: 'عشرة', en: 'Ten' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'مخرج واحد تخرج منه حروف المد الثلاثة.',
        en: 'One makhraj, for all three madd letters.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي واو تخرج من الجوف؟', en: 'Which waw comes from the jawf?' },
      options: [
        { ar: 'الواو المفتوحة', en: 'A waw with a fatha' },
        { ar: 'الواو الساكنة بعد ضم', en: 'A waw sakinah after a damma' },
        { ar: 'الواو المكسورة', en: 'A waw with a kasra' },
        { ar: 'الواو المشددة', en: 'A waw with a shaddah' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'الواو الساكنة المضموم ما قبلها حرف مد من الجوف، أما الواو المتحركة فمن الشفتين.',
        en: 'A waw sakinah after a damma is a madd letter from the jawf; a waw that carries a harakah comes from the lips.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'أي ياء تخرج من الجوف؟', en: 'Which ya comes from the jawf?' },
      options: [
        { ar: 'الياء المفتوحة', en: 'A ya with a fatha' },
        { ar: 'الياء المشددة', en: 'A ya with a shaddah' },
        { ar: 'الياء الساكنة بعد كسر', en: 'A ya sakinah after a kasra' },
        { ar: 'الياء المضمومة', en: 'A ya with a damma' },
      ],
      correctIndex: 2,
      explanation: {
        ar: 'الياء الساكنة المكسور ما قبلها حرف مد من الجوف، أما الياء المتحركة فمن وسط اللسان.',
        en: 'A ya sakinah after a kasra is a madd letter from the jawf; a ya that carries a harakah comes from the middle of the tongue.',
      },
    },
    {
      kind: 'choice',
      prompt: { ar: 'متى ينتهي صوت حرف المد؟', en: 'When does the sound of a madd letter end?' },
      options: [
        { ar: 'عند التقاء الشفتين', en: 'When the lips close' },
        { ar: 'عند انتهاء الهواء', en: 'When the breath ends' },
        { ar: 'عند ارتفاع أقصى اللسان', en: 'When the back of the tongue rises' },
        { ar: 'عند انحباس الصوت في الأنف', en: 'When the sound is held in the nose' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'ليس لحروف المد موضع ينقطع عنده الصوت، فهي تنتهي بانتهاء الهواء.',
        en: 'The madd letters have no spot where the sound stops, so they end when the breath ends.',
      },
    },
  ],
  reviewed: false,
}
