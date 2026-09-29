import type { Lesson } from './types'

export const foundations: Lesson = {
  id: 'foundations',
  order: 1,
  unit: 'foundations',
  title: { ar: 'الأساسيات: الحروف والحركات والتنوين', en: 'Foundations: letters, harakat and tanween' },
  summary: {
    ar: 'الحروف تُكتب، والحركات والسكون والشدّة والتنوين علامات فوقها أو تحتها تدلّ على كيفية نطقها؛ ثم الاستعاذة والبسملة عند بدء القراءة.',
    en: 'Letters are written; harakat, sukun, shaddah and tanween are marks above or below them that show how to say them. Then the isti‘adha and the basmala, said when you begin to recite.',
  },
  sections: [
    {
      heading: { ar: 'الحروف', en: 'The letters' },
      body: {
        ar: 'الحروف الهجائية ثمانية وعشرون حرفًا. يحتاج الحرف إلى علامة تبيّن كيف يُنطق: بفتح أم بضم أم بكسر أم بلا حركة (سكون). وتتّصل الحروف في الكلمة الواحدة، فيتغيّر شكل الحرف بحسب موقعه في أول الكلمة أو وسطها أو آخرها.',
        en: 'The Arabic alphabet has 28 letters. A letter needs a mark to show how it is said: with a fatha, a damma, a kasra, or with no vowel at all (a sukun). Letters join inside a word, so a letter changes shape depending on whether it comes at the start, the middle or the end.',
      },
    },
    {
      heading: { ar: 'الحركات: الفتحة والضمة والكسرة', en: 'Harakat: fatha, damma and kasra' },
      body: {
        ar: 'الحركات ثلاث: الفتحة (ـَ) خط صغير مائل فوق الحرف وصوتها «a» قصير، والضمة (ـُ) شكل يشبه الواو الصغيرة فوق الحرف وصوتها «u» قصير، والكسرة (ـِ) خط صغير مائل تحت الحرف وصوتها «i» قصير. الحركة القصيرة تُنطق بمقدار حركة واحدة ولا تُمدّ.',
        en: 'There are three harakat: the fatha (ـَ), a small slanted stroke above the letter, gives a short "a"; the damma (ـُ), a small waw-like curl above the letter, gives a short "u"; the kasra (ـِ), a small slanted stroke below the letter, gives a short "i". A short vowel takes one beat and is not stretched.',
      },
      animation: 'foundations-harakat',
    },
    {
      heading: { ar: 'السكون والشدّة', en: 'Sukun and shaddah' },
      body: {
        ar: 'السكون (ـْ) علامة على الحرف الذي لا حركة له: يُنطق الحرف وحده متّصلًا بالحركة التي قبله. والشدّة (ـّ) علامة على حرف مضاعف: الأول ساكن والثاني متحرك، فيُنطق حرفان في موضع واحد. وتُكتب حركة الحرف الثاني مع الشدّة، فوقها أو تحتها.',
        en: 'The sukun (ـْ) marks a letter with no vowel of its own: it is said by itself, joined to the vowel before it. The shaddah (ـّ) marks a doubled letter: the first copy has a sukun and the second has the vowel, so two letters are said in one place. The vowel of the second copy is written together with the shaddah, above or below it.',
      },
      animation: 'foundations-sukun-shadda',
    },
    {
      heading: { ar: 'التنوين', en: 'Tanween' },
      body: {
        ar: 'التنوين نون ساكنة زائدة تلحق آخر الاسم، تُنطق ولا تُكتب حرفًا. وله ثلاث صور: تنوين الفتح (ـً) وصوته «an»، وتنوين الضم (ـٌ) وصوته «un»، وتنوين الكسر (ـٍ) وصوته «in». وعند الوقف على الكلمة يُحذف التنوين، إلا تنوين الفتح فيُبدَل ألفًا. وللنون الساكنة والتنوين أحكام سيأتي شرحها في وحدة مستقلة.',
        en: 'Tanween is an extra noon sakinah added to the end of a noun; it is pronounced but not written as a letter. It has three forms: tanween fath (ـً) gives "an", tanween damm (ـٌ) gives "un", and tanween kasr (ـٍ) gives "in". When you stop on the word the tanween is dropped, except that tanween fath is turned into a long alif. The noon sakinah and tanween have their own rules, taught in a later unit.',
      },
      animation: 'foundations-tanween',
    },
    {
      heading: { ar: 'الاستعاذة', en: 'The isti‘adha' },
      body: {
        ar: 'الاستعاذة طلب الاحتماء بالله من الشيطان الرجيم، ولها صيغة معروفة يحفظها القارئ. وهي ليست آية من القرآن ولا تُكتب في المصحف. تُقال قبل بدء القراءة، سرًّا أو جهرًا، وحكمها عند جمهور العلماء سنّة.',
        en: 'The isti‘adha is asking Allah for protection from the accursed Satan, in a fixed wording the reciter learns by heart. It is not a verse of the Quran and is not written in the mushaf. It is said before you begin to recite, quietly or aloud, and is a sunnah according to most scholars.',
      },
    },
    {
      heading: { ar: 'البسملة', en: 'The basmala' },
      body: {
        ar: 'البسملة هي الآية الأولى من سورة الفاتحة في رواية حفص عن عاصم، وهي مثال هذا الدرس. وتُقرأ في أول كل سورة بعد الاستعاذة إلا سورة التوبة، وفيما عدا الفاتحة لا تُعدّ آية من السورة. وفيها كسرات وفتحة وسكون وشدّة، فانظر إليها في المثال الأول.',
        en: 'The basmala is the first verse of al-Fatiha in the riwayah of Hafs ‘an ‘Asim, and it is this lesson’s first example. After the isti‘adha it is recited at the start of every surah except at-Tawba; outside al-Fatiha it is not counted as a verse of the surah. It carries kasras, a fatha, a sukun and a shaddah, so look for them in the first example.',
      },
    },
  ],
  focusRules: [],
  examples: [
    {
      verseKey: '1:1',
      note: {
        ar: 'البسملة: في الكلمة الأولى سكون على السين وكسرة على الباء والميم، وفي الكلمة الثانية شدّة على اللام.',
        en: 'The basmala: in the first word the seen has a sukun and the ba and meem have a kasra; in the second word the lam carries a shaddah.',
      },
    },
    {
      verseKey: '1:5',
      note: {
        ar: 'في الكلمة الثانية سكون على العين، فتُنطق وحدها متّصلة بالحركة التي قبلها، وفيها فتحة وضمة.',
        en: 'In the second word the ʿayn carries a sukun, so it is said on its own, joined to the vowel before it; the word also has a fatha and a damma.',
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
        { ar: 'a', en: 'a' },
        { ar: 'u', en: 'u' },
        { ar: 'i', en: 'i' },
        { ar: 'لا صوت', en: 'No vowel' },
      ],
      correctIndex: 1,
      explanation: { ar: 'الضمة تعطي صوت «u» قصيرًا.', en: 'The damma gives a short "u".' },
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
    {
      kind: 'choice',
      prompt: { ar: 'هل الاستعاذة آية من القرآن؟', en: 'Is the isti‘adha a verse of the Quran?' },
      options: [
        { ar: 'نعم، هي آية في أول كل سورة', en: 'Yes, it is a verse at the start of each surah' },
        { ar: 'لا، تُقال قبل القراءة وليست من القرآن', en: 'No, it is said before reciting and is not part of the Quran' },
      ],
      correctIndex: 1,
    },
  ],
  reviewed: false,
}
