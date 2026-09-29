import { PRACTICE_SECTIONS } from './practice-fatiha'
import type { Lesson } from './types'

export const practiceIkhlasFalaq: Lesson = {
  id: 'practice-ikhlas-falaq',
  order: 9.1,
  unit: 'practice',
  title: { ar: 'تطبيق: سورتا الإخلاص والفلق', en: 'Practice: al-Ikhlas and al-Falaq' },
  summary: {
    ar: 'سورتان قصيرتان تكثر فيهما القلقلة والإخفاء.',
    en: 'Two short surahs full of qalqalah and ikhfa.',
  },
  sections: [
    {
      body: {
        ar: 'نقرأ في هذا الدرس سورتين قصيرتين يحفظهما أكثرنا. انتبه إلى القلقلة في أواخر الآيات، وإلى النون الساكنة قبل الشين.',
        en: 'This lesson reads two short surahs most of us know by heart. Watch for the qalqalah at the ayah ends, and for the noon sakinah before sheen.',
      },
    },
    ...PRACTICE_SECTIONS,
  ],
  // Every rule the API tags in these nine ayat (practice.test.ts checks it against quran.json).
  focusRules: ['madda_normal', 'ghunnah', 'ikhafa', 'idgham_wo_ghunnah', 'qalaqah', 'ham_wasl', 'laam_shamsiyah'],
  examples: [
    {
      verseKey: '112:1',
      note: {
        ar: 'همزة وصل، وقلقلة كبرى عند الوقف على آخر الآية.',
        en: 'A connecting hamza, and a major qalqalah when you stop at the end of the ayah.',
      },
    },
    {
      verseKey: '112:2',
      note: {
        ar: 'همزة وصل ولام شمسية في الكلمة الثانية، وقلقلة كبرى عند الوقف.',
        en: 'A connecting hamza and a sun lam in the second word, and a major qalqalah when you stop.',
      },
    },
    {
      verseKey: '112:3',
      note: {
        ar: 'قلقلتان: الأولى صغرى لأننا نصل الكلمة بما بعدها، والثانية كبرى عند الوقف على آخر الآية.',
        en: 'Two qalqalahs: the first is minor because we carry on to the next word; the second is major when we stop at the end of the ayah.',
      },
    },
    {
      verseKey: '112:4',
      note: {
        ar: 'إدغام بلا غنّة: النون الساكنة تُدغم في اللام بعدها. ثم مدّ طبيعي على الواو الصغيرة بعد الهاء، وقلقلة كبرى في آخر الآية.',
        en: 'Idgham without ghunnah: the noon sakinah merges into the lam after it. Then a natural madd on the small waw after the ha, and a major qalqalah at the end.',
      },
    },
    {
      verseKey: '113:1',
      note: {
        ar: 'همزة وصل، وقلقلة كبرى عند الوقف على آخر الآية.',
        en: 'A connecting hamza, and a major qalqalah when you stop at the end of the ayah.',
      },
    },
    {
      verseKey: '113:2',
      note: {
        ar: 'إخفاء: النون الساكنة قبل الشين تُخفى مع غنّة. وقلقلة كبرى في آخر الآية.',
        en: 'Ikhfa: the noon sakinah before sheen is hidden, with a ghunnah. A major qalqalah at the end.',
      },
    },
    {
      verseKey: '113:3',
      note: {
        ar: 'إخفاء النون قبل الشين مرة أخرى، وقلقلة كبرى على الباء عند الوقف.',
        en: 'Ikhfa of the noon before sheen again, and a major qalqalah on the ba when you stop.',
      },
    },
    {
      verseKey: '113:4',
      note: {
        ar: 'إخفاء في أولها، ثم كلمة فيها همزة وصل ولام شمسية ونون مشدّدة بغنّة ومدّان طبيعيان، ثم همزة وصل وقلقلة كبرى في الكلمة الأخيرة.',
        en: 'Ikhfa at the start; then one word with a connecting hamza, a sun lam, a doubled noon with ghunnah and two natural madds; then a connecting hamza and a major qalqalah in the last word.',
      },
    },
    {
      verseKey: '113:5',
      note: {
        ar: 'إخفاء النون قبل الشين، وقلقلة كبرى عند الوقف على آخر الآية.',
        en: 'Ikhfa of the noon before sheen, and a major qalqalah when you stop at the end.',
      },
    },
  ],
  reviewed: false,
  quiz: [
    {
      kind: 'tap',
      prompt: {
        ar: 'اضغط على كل حرف فيه قلقلة في هذه الآية.',
        en: 'Tap every letter with qalqalah in this ayah.',
      },
      verseKey: '112:3',
      rule: 'qalaqah',
    },
    {
      kind: 'choice',
      prompt: {
        ar: 'ما حكم النون الساكنة قبل الشين في سورة الفلق؟',
        en: 'Which rule applies to the noon sakinah before sheen in al-Falaq?',
      },
      options: [
        { ar: 'إظهار', en: 'Izhar' },
        { ar: 'إدغام', en: 'Idgham' },
        { ar: 'إقلاب', en: 'Iqlab' },
        { ar: 'إخفاء', en: 'Ikhfa' },
      ],
      correctIndex: 3,
      explanation: {
        ar: 'الشين من حروف الإخفاء الخمسة عشر، فتُخفى النون مع غنّة.',
        en: 'Sheen is one of the fifteen ikhfa letters, so the noon is hidden with a ghunnah.',
      },
    },
  ],
}
