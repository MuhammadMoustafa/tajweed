import { formatNumber, type Bilingual, type Locale } from './bilingual'

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
  answerAllFirst: { ar: 'أجب عن الأسئلة المميَّزة أولًا', en: 'Answer the highlighted questions first' },
  notAnsweredYet: { ar: 'لم تُجب عن هذا السؤال بعد', en: 'Not answered yet' },
  tryAgain: { ar: 'حاول مرة أخرى', en: 'Try again' },
  quizCorrect: { ar: 'إجابة صحيحة!', en: 'Correct!' },
  quizIncorrect: { ar: 'إجابة غير صحيحة.', en: 'Not quite.' },
  yourScore: { ar: 'نتيجتك', en: 'Your score' },
  correctLetters: { ar: 'الحروف الصحيحة', en: 'Correct letters' },
  previousLesson: { ar: 'الدرس السابق', en: 'Previous lesson' },
  nextLesson: { ar: 'الدرس التالي', en: 'Next lesson' },
  lessonNavigation: { ar: 'التنقل بين الدروس', en: 'Lesson navigation' },
  markAsLearned: { ar: 'وضع علامة "تم التعلّم"', en: 'Mark as learned' },
  markedAsLearned: { ar: 'تم التعلّم', en: 'Learned' },
  /** Template for the lesson-list progress summary; `{learned}`/`{total}` are filled by formatLearnedCount. */
  learnedCount: { ar: '{learned} من {total} تم تعلّمها', en: '{learned} of {total} learned' },
  /** MatnPanel's <summary>: shown identically in both locales, so either reader recognizes it. */
  matnPanelSummary: {
    ar: 'من المتن · From the classical texts',
    en: 'من المتن · From the classical texts',
  },
  matnSource: { ar: 'المصدر', en: 'Source' },
  /** Prefix before a matn line's number, e.g. "البيت ٢٤" / "Line 24". */
  matnLine: { ar: 'البيت', en: 'Line' },
  matnTuhfaTitle: { ar: 'تحفة الأطفال', en: 'Tuhfat al-Atfal' },
  matnJazariyyaTitle: { ar: 'المقدمة الجزرية', en: 'Al-Muqaddimah al-Jazariyyah' },
} satisfies Record<string, Bilingual>

/**
 * "3 of 20 learned" / "٣ من ٢٠ تم تعلّمها" — digits via Intl.NumberFormat so Arabic renders
 * Arabic-Indic numerals (the `ar` macro-locale defaults to Latin digits without the explicit
 * numbering system).
 */
export function formatLearnedCount(locale: Locale, learned: number, total: number): string {
  return ui.learnedCount[locale]
    .replace('{learned}', formatNumber(locale, learned))
    .replace('{total}', formatNumber(locale, total))
}
