import type { Lesson } from './types'
import { vowel } from './vowels'

const [fatha, damma, kasra] = [vowel('fatha'), vowel('damma'), vowel('kasra')]
const each = (f: (v: typeof fatha) => string) => [fatha, damma, kasra].map(f).join('؛ ')

export const foundationsHarakat: Lesson = {
  id: 'foundations-harakat',
  order: 1.1,
  unit: 'foundations',
  title: { ar: 'الأساسيات: الحركات والسكون', en: 'Foundations: harakat and sukun' },
  summary: {
    ar: 'الفتحة والضمة والكسرة حركات قصيرة تُنطق بمقدار حركة واحدة، والسكون علامة على حرف لا حركة له.',
    en: 'Fatha, damma and kasra are short vowels of one beat each; the sukun marks a letter with no vowel.',
  },
  sections: [
    {
      heading: { ar: 'الحركات: الفتحة والضمة والكسرة', en: 'Harakat: fatha, damma and kasra' },
      body: {
        ar: `الحركات ثلاث، وأسماؤها من عمل الفم: ${each((v) => `${v.label.ar} (${v.syllable}): ${v.mouthDoes.ar}، وصوتها ${v.ipa}، وكلمة تسمعها فيها: ${v.word}`)}. الحركة القصيرة تُنطق بمقدار حركة واحدة ولا تُمدّ.`,
        en: `There are three harakat, and their names come from what the mouth does: ${each((v) => `${v.label.en} (${v.syllable}): ${v.mouthDoes.en}; heard in ${v.word}, it gives ${v.ipa}, close to ${v.englishLike} (approximate)`)}. A short vowel takes one beat and is not stretched.`,
      },
      animation: 'foundations-harakat',
    },
    {
      heading: { ar: 'السكون', en: 'Sukun' },
      body: {
        ar: 'السكون (ـْ) علامة على الحرف الذي لا حركة له: يُنطق الحرف وحده متّصلًا بالحركة التي قبله. ولا يبدأ الكلام بحرف ساكن.',
        en: 'The sukun (ـْ) marks a letter with no vowel of its own: it is said by itself, joined to the vowel before it. A word never begins with a letter that has a sukun.',
      },
      animation: 'foundations-sukun',
    },
  ],
  focusRules: [],
  examples: [
    {
      verseKey: '1:5',
      note: {
        ar: 'في الكلمة الثانية سكون على العين، فتُنطق وحدها متّصلة بالحركة التي قبلها، وفيها فتحة وضمة.',
        en: 'In the second word the ʿayn carries a sukun, so it is said on its own, joined to the vowel before it; the word also has a fatha and a damma.',
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
      prompt: { ar: 'أي حركة تُكتب تحت الحرف؟', en: 'Which haraka is written below the letter?' },
      options: [
        { ar: 'الفتحة', en: 'Fatha' },
        { ar: 'الضمة', en: 'Damma' },
        { ar: 'الكسرة', en: 'Kasra' },
        { ar: 'السكون', en: 'Sukun' },
      ],
      correctIndex: 2,
      explanation: { ar: 'الكسرة تحت الحرف، والفتحة والضمة فوقه.', en: 'The kasra goes below the letter; the fatha and damma go above.' },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ما الصوت الذي تعطيه الضمة؟', en: 'Which sound does the damma give?' },
      options: [
        { ar: fatha.syllable, en: `${fatha.syllable} ${fatha.ipa}` },
        { ar: damma.syllable, en: `${damma.syllable} ${damma.ipa}` },
        { ar: kasra.syllable, en: `${kasra.syllable} ${kasra.ipa}` },
        { ar: 'لا صوت', en: 'No vowel' },
      ],
      correctIndex: 1,
      explanation: { ar: `الضمة تعطي صوتًا قصيرًا هو ${damma.syllable}.`, en: `The damma gives the short vowel ${damma.ipa}, as in ${damma.syllable}.` },
    },
    {
      kind: 'choice',
      prompt: { ar: 'ماذا يعني السكون؟', en: 'What does the sukun mean?' },
      options: [
        { ar: 'الحرف مضاعف', en: 'The letter is doubled' },
        { ar: 'الحرف بلا حركة', en: 'The letter has no vowel' },
        { ar: 'الحرف يُمدّ', en: 'The letter is stretched' },
        { ar: 'الحرف لا يُنطق', en: 'The letter is not pronounced' },
      ],
      correctIndex: 1,
      explanation: { ar: 'السكون علامة على حرف لا حركة له، ويُنطق ساكنًا.', en: 'The sukun marks a letter with no vowel; it is still pronounced.' },
    },
  ],
  reviewed: false,
}
