import type { Lesson } from './types'

export const foundationsBasmala: Lesson = {
  id: 'foundations-basmala',
  order: 1.3,
  unit: 'foundations',
  title: { ar: 'الأساسيات: الاستعاذة والبسملة', en: 'Foundations: the isti‘adha and the basmala' },
  summary: {
    ar: 'الاستعاذة والبسملة يُبدأ بهما القراءة: الاستعاذة ليست من القرآن، والبسملة أول آية من الفاتحة.',
    en: 'The isti‘adha and the basmala open a recitation: the isti‘adha is not part of the Quran, the basmala is the first verse of al-Fatiha.',
  },
  sections: [
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
        ar: 'البسملة هي الآية الأولى من سورة الفاتحة في رواية حفص عن عاصم. وتُقرأ في أول كل سورة بعد الاستعاذة إلا سورة التوبة، وفيما عدا الفاتحة لا تُعدّ آية من السورة.',
        en: 'The basmala is the first verse of al-Fatiha in the riwayah of Hafs ‘an ‘Asim. After the isti‘adha it is recited at the start of every surah except at-Tawba; outside al-Fatiha it is not counted as a verse of the surah.',
      },
    },
  ],
  focusRules: [],
  examples: [
    {
      verseKey: '1:1',
      note: {
        ar: 'البسملة: الآية الأولى من الفاتحة. وفيها كسرات وفتحة وسكون وشدّة مما تعلّمته في الدروس السابقة.',
        en: 'The basmala: the first verse of al-Fatiha. It carries kasras, a fatha, a sukun and a shaddah, all met in the earlier lessons.',
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
