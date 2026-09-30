import type { Lesson } from './types'

export const foundations: Lesson = {
  id: 'foundations',
  order: 1,
  unit: 'foundations',
  title: { ar: 'الأساسيات: الحروف', en: 'Foundations: the letters' },
  summary: {
    ar: 'الحروف الهجائية تسعة وعشرون حرفًا تُكتب متّصلة، وتحتاج إلى علامات تبيّن كيف تُنطق؛ هذا أول دروس الأساسيات.',
    en: 'The 29 letters join inside a word and need marks to show how they are said. This is the first of four foundation lessons.',
  },
  sections: [
    {
      heading: { ar: 'الحروف', en: 'The letters' },
      body: {
        ar: 'الحروف الهجائية تسعة وعشرون حرفًا. ويعدّها بعض الناس ثمانية وعشرين فيجعلون الهمزة والألف حرفًا واحدًا، والصواب عند علماء التجويد أنهما حرفان: الهمزة تخرج من أقصى الحلق، والألف حرف مدّ يخرج من الجوف. يحتاج الحرف إلى علامة تبيّن كيف يُنطق: بفتح أم بضم أم بكسر أم بلا حركة (سكون). وتتّصل الحروف في الكلمة الواحدة، فيتغيّر شكل الحرف بحسب موقعه في أول الكلمة أو وسطها أو آخرها.',
        en: 'The Arabic alphabet has 29 letters. Some count 28, treating hamzah and alif as one letter, but tajweed scholars count them as two: hamzah comes from the deepest part of the throat, while alif is a madd letter from the open space of the mouth and throat (al-jawf). A letter needs a mark to show how it is said: with a fatha, a damma, a kasra, or with no vowel at all (a sukun). Letters join inside a word, so a letter changes shape depending on whether it comes at the start, the middle or the end.',
      },
      link: {
        href: '#/letters',
        label: { ar: 'بطاقات الحروف: مخرج كل حرف وصفاته وصوته', en: 'The letter cards: each letter’s makhraj, qualities and sound' },
      },
    },
  ],
  focusRules: [],
  examples: [
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: 'not-covered',
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'كم حرفًا في الأبجدية العربية؟', en: 'How many letters are in the Arabic alphabet?' },
      options: [
        { ar: 'تسعة وعشرون', en: '29' },
        { ar: 'ثمانية وعشرون', en: '28' },
        { ar: 'ثلاثون', en: '30' },
      ],
      correctIndex: 0,
      explanation: {
        ar: 'تسعة وعشرون: الهمزة والألف حرفان مختلفان في المخرج، ومن عدّها ثمانية وعشرين جعلهما حرفًا واحدًا.',
        en: 'There are 29: hamzah and alif are two letters with different makharij. The count of 28 treats them as one.',
      },
    },
  ],
  reviewed: false,
}
