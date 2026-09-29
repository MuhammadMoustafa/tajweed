import type { Lesson } from './types'

export const foundationsShaddahTanween: Lesson = {
  id: 'foundations-shaddah-tanween',
  order: 1.2,
  unit: 'foundations',
  title: { ar: 'الأساسيات: الشدّة والتنوين', en: 'Foundations: shaddah and tanween' },
  summary: {
    ar: 'الشدّة تضاعف الحرف، والتنوين نون ساكنة تلحق آخر الاسم وتُنطق ولا تُكتب.',
    en: 'The shaddah doubles a letter; tanween is a noon sakinah added to the end of a noun, pronounced but not written.',
  },
  sections: [
    {
      heading: { ar: 'الشدّة', en: 'Shaddah' },
      body: {
        ar: 'الشدّة (ـّ) علامة على حرف مضاعف: الأول ساكن والثاني متحرك، فيُنطق حرفان في موضع واحد. وتُكتب حركة الحرف الثاني مع الشدّة، فوقها أو تحتها.',
        en: 'The shaddah (ـّ) marks a doubled letter: the first copy has a sukun and the second has the vowel, so two letters are said in one place. The vowel of the second copy is written together with the shaddah, above or below it.',
      },
      animation: 'foundations-shadda',
    },
    {
      heading: { ar: 'التنوين', en: 'Tanween' },
      body: {
        ar: 'التنوين نون ساكنة زائدة تلحق آخر الاسم، تُنطق ولا تُكتب حرفًا. وله ثلاث صور: تنوين الفتح (ـً) وصوته «an»، وتنوين الضم (ـٌ) وصوته «un»، وتنوين الكسر (ـٍ) وصوته «in». وعند الوقف على الكلمة يُحذف التنوين، إلا تنوين الفتح فيُبدَل ألفًا. وللنون الساكنة والتنوين أحكام سيأتي شرحها في وحدة مستقلة.',
        en: 'Tanween is an extra noon sakinah added to the end of a noun; it is pronounced but not written as a letter. It has three forms: tanween fath (ـً) gives "an", tanween damm (ـٌ) gives "un", and tanween kasr (ـٍ) gives "in". When you stop on the word the tanween is dropped, except that tanween fath is turned into a long alif. The noon sakinah and tanween have their own rules, taught in a later unit.',
      },
      animation: 'foundations-tanween',
    },
  ],
  focusRules: [],
  examples: [
    {
      verseKey: '1:1',
      note: {
        ar: 'في الكلمة الثانية شدّة على اللام: حرفان في موضع واحد.',
        en: 'In the second word the lam carries a shaddah: two letters said in one place.',
      },
    },
    {
      verseKey: '112:4',
      note: {
        ar: 'الكلمة الرابعة تنتهي بتنوين فتح، وصوته «an».',
        en: 'The fourth word ends with a tanween fath, which gives "an".',
      },
    },
  ],
  mutoon: {
    tuhfa: 'not-covered',
    jazariyya: 'not-covered',
  },
  quiz: [
    {
      kind: 'choice',
      prompt: { ar: 'ماذا تدلّ عليه الشدّة؟', en: 'What does the shaddah show?' },
      options: [
        { ar: 'حرف مضاعف: ساكن ثم متحرك', en: 'A doubled letter: one with sukun, then one with a vowel' },
        { ar: 'مدّ ست حركات', en: 'A six-count stretch' },
        { ar: 'حرف محذوف', en: 'A dropped letter' },
        { ar: 'نون زائدة', en: 'An extra noon' },
      ],
      correctIndex: 0,
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الصوت الذي يعطيه تنوين الكسر؟', en: 'Which sound does tanween kasr give?' },
      options: [
        { ar: 'an', en: 'an' },
        { ar: 'un', en: 'un' },
        { ar: 'in', en: 'in' },
        { ar: 'i طويلة', en: 'A long "ee"' },
      ],
      correctIndex: 2,
      explanation: { ar: 'تنوين الكسر كسرتان وصوته «in».', en: 'Tanween kasr is two kasras, giving "in".' },
    },
  ],
  reviewed: false,
}
