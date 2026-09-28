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
  // AnimationPlayer (src/animations/player/AnimationPlayer.tsx)
  play: { ar: 'تشغيل', en: 'Play' },
  stepBack: { ar: 'الخطوة السابقة', en: 'Previous step' },
  stepForward: { ar: 'الخطوة التالية', en: 'Next step' },
  seek: { ar: 'موضع الحركة', en: 'Animation position' },
  speed: { ar: 'السرعة', en: 'Speed' },
  /** Template filled by formatTemplate with `{step}`/`{total}`. */
  stepOf: { ar: 'الخطوة {step} من {total}', en: 'Step {step} of {total}' },
  /** Pressed = the reciter's audio in clip steps (ClipStep.audio) is muted. */
  muteReciter: { ar: 'كتم صوت القارئ', en: 'Mute the reciter' },
  /** Followed by the reciter's name (WORD_RECITATION in src/data/quran.ts). */
  recitedBy: { ar: 'بصوت', en: 'Recited by' },
  /** Template filled by formatTemplate with `{surah}`/`{ayah}`/`{word}`: where a clip's word is. */
  wordRef: { ar: 'سورة {surah}، الآية {ayah}، الكلمة {word}', en: 'surah {surah}, ayah {ayah}, word {word}' },
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
  testYourself: { ar: 'اختبر نفسك', en: 'Test yourself' },
  backToLesson: { ar: 'العودة إلى الدرس', en: 'Back to the lesson' },
  quizScope: {
    ar: 'أسئلة عن أحكام هذا الدرس وما قبله، من أمثلة الدرس ومن آيات في القرآن كله.',
    en: 'Questions on the rules taught up to this lesson, from its examples and from ayat across the whole Quran.',
  },
  difficulty: { ar: 'المستوى', en: 'Difficulty' },
  difficultyEasy: { ar: 'سهل', en: 'Easy' },
  difficultyMedium: { ar: 'متوسط', en: 'Medium' },
  difficultyHard: { ar: 'صعب', en: 'Hard' },
  newQuestions: { ar: 'أسئلة جديدة', en: 'New questions' },
  loadingQuiz: { ar: 'جارٍ تحميل الأسئلة…', en: 'Loading questions…' },
  /** Template for a generated tap question; `{rule}` is filled by withRuleName. */
  quizTapPrompt: { ar: 'اضغط على كل حرف عليه هذا الحكم: {rule}', en: 'Tap every letter with this rule: {rule}' },
  highlightedLetter: { ar: 'الحرف المميَّز', en: 'Highlighted letter' },
  wordNumber: { ar: 'الكلمة', en: 'word' },
  quizRulePrompt: { ar: 'ما الحكم على الحرف المميَّز؟', en: 'Which rule applies to the highlighted letter?' },
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
  /** Shown in a poem's own block of the matn panel when that poem has no section on the lesson's
   * rule (the other poem's block, shown right beside it, is expected to cover it instead). */
  matnNotCovered: {
    ar: 'ليس في هذا المتن باب يتناول هذا الحكم.',
    en: 'This text has no section on this rule.',
  },

  // Progress page (#/progress) and home-card states (src/components/ProgressPage.tsx, LessonList.tsx)
  progressTitle: { ar: 'التقدّم', en: 'Progress' },
  progressEmpty: {
    ar: 'لم تبدأ التعلّم بعد. افتح أحد الدروس لتبدأ.',
    en: "You haven't started learning yet. Open a lesson to begin.",
  },
  /** Template for a lesson's attempt count; `{count}` is filled by formatAttemptsCount. */
  attemptsCount: { ar: '{count} محاولة', en: '{count} attempts' },
  noAttemptsYet: { ar: 'لا محاولات بعد', en: 'No attempts yet' },
  bestScore: { ar: 'أفضل نتيجة', en: 'Best score' },
  lastScore: { ar: 'آخر نتيجة', en: 'Last score' },
  ruleAccuracyHeading: { ar: 'الدقة حسب كل حكم', en: 'Accuracy by rule' },
  ruleAccuracyEmpty: {
    ar: 'لا توجد بيانات بعد. اختبر نفسك في أي درس لرؤية دقتك هنا.',
    en: 'No data yet. Take a quiz in any lesson to see your accuracy here.',
  },
  resetProgress: { ar: 'إعادة ضبط التقدّم', en: 'Reset progress' },
  resetConfirmQuestion: {
    ar: 'هل تريد حذف كل بيانات التقدّم؟ لا يمكن التراجع عن هذا.',
    en: 'Delete all progress data? This cannot be undone.',
  },
  resetConfirmYes: { ar: 'نعم، إعادة الضبط', en: 'Yes, reset' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  // Lesson-card states on the home page: color is never the only signal (each also gets this text).
  // The "learned" state reuses ui.markedAsLearned (same meaning as the lesson page's toggle).
  cardStateStarted: { ar: 'بدأ التعلّم', en: 'Started' },
  cardStateNotStarted: { ar: 'لم يبدأ', en: 'Not started' },
  nextLessonBadge: { ar: 'التالي', en: 'Next' },
  cardStateLegend: {
    ar: 'أخضر: تم التعلّم · كهرماني: بدأ التعلّم · حدّ ملوّن: الدرس التالي المقترح',
    en: 'Green: learned · Amber: started · Accent border: suggested next lesson',
  },
} satisfies Record<string, Bilingual>

/** Fills a `{rule}` template (e.g. `ui.quizTapPrompt`) with a rule's name, in both languages. */
export const withRuleName = (template: Bilingual, name: Bilingual): Bilingual => ({
  ar: template.ar.replace('{rule}', name.ar),
  en: template.en.replace('{rule}', name.en),
})

/**
 * Fills a template's `{name}` slots with numbers in the locale's own digits (via formatNumber,
 * so Arabic renders Arabic-Indic numerals), e.g. `ui.stepOf` → "Step 2 of 5" / "الخطوة ٢ من ٥".
 */
export function formatTemplate(locale: Locale, template: Bilingual, values: Record<string, number>): string {
  return template[locale].replace(/\{(\w+)\}/g, (slot, name: string) =>
    name in values ? formatNumber(locale, values[name]) : slot,
  )
}

/** "3 of 20 learned" / "٣ من ٢٠ تم تعلّمها". */
export function formatLearnedCount(locale: Locale, learned: number, total: number): string {
  return formatTemplate(locale, ui.learnedCount, { learned, total })
}

/** "3 attempts" / "٣ محاولة" (see ui.attemptsCount). */
export function formatAttemptsCount(locale: Locale, count: number): string {
  return formatTemplate(locale, ui.attemptsCount, { count })
}
