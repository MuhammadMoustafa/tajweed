import type { Lesson } from './types'

export const foundations: Lesson = {
  id: 'foundations',
  order: 1,
  unit: 'foundations',
  title: { ar: 'الأساسيات: الحروف', en: 'Foundations: the letters' },
  summary: {
    ar: 'الحروف الهجائية ثمانية وعشرون حرفًا تُكتب متّصلة، وتحتاج إلى علامات تبيّن كيف تُنطق؛ هذا أول دروس الأساسيات.',
    en: 'The 28 letters join inside a word and need marks to show how they are said. This is the first of four foundation lessons.',
  },
  sections: [
    {
      heading: { ar: 'الحروف', en: 'The letters' },
      body: {
        ar: 'الحروف الهجائية ثمانية وعشرون حرفًا. يحتاج الحرف إلى علامة تبيّن كيف يُنطق: بفتح أم بضم أم بكسر أم بلا حركة (سكون). وتتّصل الحروف في الكلمة الواحدة، فيتغيّر شكل الحرف بحسب موقعه في أول الكلمة أو وسطها أو آخرها.',
        en: 'The Arabic alphabet has 28 letters. A letter needs a mark to show how it is said: with a fatha, a damma, a kasra, or with no vowel at all (a sukun). Letters join inside a word, so a letter changes shape depending on whether it comes at the start, the middle or the end.',
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
        { ar: 'ثمانية وعشرون', en: '28' },
        { ar: 'ستة وعشرون', en: '26' },
        { ar: 'ثلاثون', en: '30' },
      ],
      correctIndex: 0,
    },
  ],
  reviewed: false,
}
