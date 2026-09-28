import type { Bilingual } from './bilingual'

/** Interface strings (not lesson content — that lives in src/lessons). */
export const ui = {
  appTitle: { ar: 'تعلّم التجويد', en: 'Learn Tajweed' },
  appTagline: {
    ar: 'أحكام التجويد للمبتدئين خطوة بخطوة',
    en: 'Tajweed rules for beginners, one step at a time',
  },
  switchLanguage: { ar: 'English', en: 'العربية' },
  lessons: { ar: 'الدروس', en: 'Lessons' },
  backToLessons: { ar: 'العودة إلى الدروس', en: 'Back to lessons' },
  examples: { ar: 'أمثلة من القرآن', en: 'Examples from the Quran' },
  legend: { ar: 'دليل الألوان', en: 'Color guide' },
  listen: { ar: 'استمع', en: 'Listen' },
  pause: { ar: 'إيقاف', en: 'Pause' },
  replay: { ar: 'إعادة الحركة', en: 'Replay animation' },
  notReviewed: {
    ar: 'هذا الدرس لم يُراجَع بعد من معلّم مُجاز.',
    en: 'This lesson has not yet been reviewed by a qualified teacher.',
  },
  lessonNotFound: { ar: 'الدرس غير موجود.', en: 'Lesson not found.' },
  quizTitle: { ar: 'اختبر نفسك', en: 'Practice quiz' },
  checkAnswers: { ar: 'تحقق من الإجابات', en: 'Check answers' },
  tryAgain: { ar: 'حاول مرة أخرى', en: 'Try again' },
  quizCorrect: { ar: 'إجابة صحيحة!', en: 'Correct!' },
  quizIncorrect: { ar: 'إجابة غير صحيحة.', en: 'Not quite.' },
  yourScore: { ar: 'نتيجتك', en: 'Your score' },
  correctLetters: { ar: 'الحروف الصحيحة', en: 'Correct letters' },
} satisfies Record<string, Bilingual>
