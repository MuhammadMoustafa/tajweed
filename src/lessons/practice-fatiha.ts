import type { Lesson, LessonSection } from './types'

/**
 * The two sections every lesson of the practice unit shares after its own introduction: how to
 * practise a surah with the colored text, and what happens at the end of each ayah.
 */
export const PRACTICE_SECTIONS: LessonSection[] = [
  {
    heading: { ar: 'كيف تتدرّب', en: 'How to practise' },
    body: {
      ar: 'استمع إلى الآية أولًا، ثم اقرأها مع التلاوة، ثم وحدك. عند كل حرف ملوَّن سمِّ الحكم قبل أن تنظر إلى مفتاح الألوان، ثم تحقّق من اسمه ولونه فيه، وارجع إلى درس الحكم إن نسيته. بعض الأحكام لا تُلوَّن، كالإظهار واللام القمرية وتفخيم حروف الاستعلاء وكثير من المدود الطبيعية، فطبّقها أيضًا وأنت تقرأ.',
      en: 'Listen to the ayah first, then read along with the recitation, then on your own. At each colored letter, name the rule before you look at the color key, then check its name and color there, and go back to the rule’s lesson if you have forgotten it. Some rules are not colored, such as izhar, the moon lam, the heaviness of the raised letters and many natural madds: apply them as you read all the same.',
    },
  },
  {
    heading: { ar: 'عند أواخر الآيات', en: 'At the end of each ayah' },
    body: {
      ar: 'قِف على آخر كل آية بتسكين الحرف الأخير. إن كان قبله حرف مدّ فهو مدّ عارض للسكون: حركتان أو أربع أو ست، والتزم طولًا واحدًا في السورة كلها. وإن كان الحرف الأخير من حروف القلقلة فقلقلته كبرى.',
      en: 'Stop at the end of each ayah with a sukun on the last letter. If a madd letter comes before it, that is a madd ʿarid lis-sukun of 2, 4 or 6 counts: keep one length throughout the surah. If the last letter is a qalqalah letter, its qalqalah is major.',
    },
  },
]

export const practiceFatiha: Lesson = {
  id: 'practice-fatiha',
  order: 9,
  unit: 'practice',
  title: { ar: 'تطبيق: سورة الفاتحة', en: 'Practice: al-Fatiha' },
  summary: {
    ar: 'اقرأ الفاتحة آيةً آية، وسمِّ كل حكم ملوَّن تعلّمته.',
    en: 'Read al-Fatiha ayah by ayah and name every colored rule you have learned.',
  },
  sections: [
    {
      body: {
        ar: 'الفاتحة تُقرأ في كل ركعة، فهي أولى السور بالإتقان. لا حكم جديد في هذا الدرس: نجمع ما تعلّمناه في سورة واحدة.',
        en: 'Al-Fatiha is recited in every rakʿah, so it is the first surah to get right. This lesson adds no new rule: it brings together what you have learned, in one surah.',
      },
    },
    ...PRACTICE_SECTIONS,
  ],
  // Every rule the API tags in these seven ayat (practice.test.ts checks it against quran.json).
  focusRules: ['madda_necessary', 'madda_permissible', 'madda_normal', 'ham_wasl', 'laam_shamsiyah'],
  examples: [
    {
      verseKey: '1:1',
      note: {
        ar: 'همزات وصل، ولام شمسية لا تُنطق مرتين، ومدّ طبيعي، ومدّ عارض للسكون عند الوقف على آخرها.',
        en: 'Connecting hamzas, a silent sun lam twice, a natural madd, and a madd ʿarid when you stop at the end.',
      },
    },
    {
      verseKey: '1:2',
      note: {
        ar: 'همزة وصل في أولها، ومدّ طبيعي، ومدّ عارض للسكون في آخرها.',
        en: 'A connecting hamza at the start, a natural madd, and a madd ʿarid at the end.',
      },
    },
    {
      verseKey: '1:3',
      note: {
        ar: 'لام شمسية في الكلمتين، وهمزة وصل، ومدّ طبيعي، ومدّ عارض عند الوقف.',
        en: 'A sun lam in both words, a connecting hamza, a natural madd, and a madd ʿarid when you stop.',
      },
    },
    {
      verseKey: '1:4',
      note: {
        ar: 'مدّ طبيعي في الكلمة الأولى، وهمزة وصل ولام شمسية في الكلمة الأخيرة، ثم مدّ عارض عند الوقف.',
        en: 'A natural madd in the first word; a connecting hamza and a sun lam in the last word, then a madd ʿarid when you stop.',
      },
    },
    {
      verseKey: '1:5',
      note: {
        ar: 'لا يُلوَّن فيها إلا المدّ العارض في آخرها، فقِف عليه بالطول الذي اخترته في الآيات قبلها.',
        en: 'Only the madd ʿarid at the end is colored: stop on it with the same length you chose for the earlier ayat.',
      },
    },
    {
      verseKey: '1:6',
      note: {
        ar: 'همزتا وصل، ولام شمسية في الكلمة الثانية، ومدّ طبيعي، ومدّ عارض في آخرها. أما لام الكلمة الأخيرة فقمرية تُنطق.',
        en: 'Two connecting hamzas, a sun lam in the second word, a natural madd, and a madd ʿarid at the end. The lam of the last word is a moon lam, so it is pronounced.',
      },
    },
    {
      verseKey: '1:7',
      note: {
        ar: 'في الكلمة الأخيرة: همزة وصل، ولام شمسية، ومدّ لازم ستّ حركات، ومدّ عارض عند الوقف. وقبلها مدّ طبيعي وهمزتا وصل.',
        en: 'In the last word: a connecting hamza, a sun lam, a necessary madd of six counts, and a madd ʿarid when you stop. Earlier in the ayah: a natural madd and two connecting hamzas.',
      },
    },
  ],
  reviewed: false,
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
      prompt: {
        ar: 'كم حركة يُمدّ المدّ العارض للسكون عند الوقف على آخر الآية؟',
        en: 'How many counts can a madd ʿarid lis-sukun take when you stop at the end of an ayah?',
      },
      options: [
        { ar: 'حركتان فقط', en: '2 only' },
        { ar: 'حركتان أو أربع أو ست', en: '2, 4 or 6' },
        { ar: 'أربع أو خمس', en: '4 or 5' },
        { ar: 'ست فقط', en: '6 only' },
      ],
      correctIndex: 1,
      explanation: {
        ar: 'يجوز فيه القصر (حركتان) والتوسط (أربع) والطول (ست)، مع التزام طول واحد في القراءة كلها.',
        en: 'It may be short (2), medium (4) or long (6); keep one length throughout your reading.',
      },
    },
  ],
}
