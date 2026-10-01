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
  /**
   * Template filled by formatTemplate with `{surah}` (its name), `{number}` (the surah's), `{ayah}`
   * and `{word}`: where a clip's word is. The name is for learners, the number for finding it.
   */
  wordRef: { ar: 'سورة {surah} ({number})، الآية {ayah}، الكلمة {word}', en: '{surah} ({number}), ayah {ayah}, word {word}' },
  /** Template filled by formatTemplate with `{surah}` (its name), `{number}` and `{ayah}`: an example's ayah. */
  verseRef: { ar: 'سورة {surah} ({number})، الآية {ayah}', en: '{surah} ({number}), ayah {ayah}' },
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
  /** Under the score of a passing attempt (progress.ts `passesQuiz`), which marks the lesson learned. */
  quizPassed: {
    ar: 'أحسنت! نجحت في الاختبار، فعُلِّم الدرس بأنه تم تعلّمه.',
    en: 'Well done! You passed, so the lesson is marked as learned.',
  },
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
  advancedHeading: { ar: 'متقدّم', en: 'Advanced' },
  advancedNote: {
    ar: 'تعمّق اختياري بعد أن تُتقن الدروس الأساسية.',
    en: 'Optional extra depth, best after the core lessons.',
  },
  /** Template for a unit header's number on the home list; `{n}` is filled by formatTemplate. */
  unitNumber: { ar: 'الوحدة {n}', en: 'Unit {n}' },
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
  // Lesson-card primary action (label follows the card's state).
  startLessonAction: { ar: 'ابدأ الدرس', en: 'Start lesson' },
  /** A card's action once the lesson is started (its quiz taken) or learned (maintainer, 2026-09-29). */
  reviewLessonAction: { ar: 'راجع الدرس', en: 'Review lesson' },
  // Lesson-card quiz side panel (src/components/LessonCard.tsx).
  takeQuizButton: { ar: 'ابدأ الاختبار', en: 'Take the quiz' },
  retryQuizButton: { ar: 'إعادة الاختبار', en: 'Retry quiz' },
  // The letters page (#/letters, src/components/LettersPage.tsx) and a letter's card (LetterView.tsx).
  lettersTitle: { ar: 'الحروف', en: 'Letters' },
  lettersIntro: {
    ar: 'الحروف تسعة وعشرون، لكل حرف بطاقة: مخرجه مرسومًا على الفم، وصفاته، وكلمة من القرآن تسمعه فيها بصوت الشيخ الحصري. والهمزة والألف حرفان مختلفان في المخرج، فلكلٍّ منهما بطاقة.',
    en: 'There are 29 letters, each with a card: its makhraj drawn on the mouth, its qualities, and a Quran word to hear it in, recited by Sheikh al-Husary. Hamzah and alif are two letters with different makharij, so each has its own card.',
  },
  openLetterAction: { ar: 'تعلّم نطقه', en: 'Learn to say it' },
  backToLetters: { ar: 'العودة إلى الحروف', en: 'Back to the letters' },
  letterNotFound: { ar: 'الحرف غير موجود.', en: 'Letter not found.' },
  lettersNotReviewed: {
    ar: 'بطاقات الحروف لم تُراجَع بعد من معلّم مُجاز.',
    en: 'These letter cards have not yet been reviewed by a qualified teacher.',
  },
  letterMakhraj: { ar: 'المخرج', en: 'Makhraj: where it comes from' },
  letterArea: { ar: 'الموضع', en: 'Area' },
  letterPoint: { ar: 'المخرج بالتحديد', en: 'Exact point' },
  letterSifat: { ar: 'الصفات', en: 'Qualities (sifat)' },
  letterPairedSifat: { ar: 'صفة من كل زوج من الصفات المتضادة', en: 'One quality from each pair of opposites' },
  letterSingleSifat: { ar: 'صفات خاصة ببعض الحروف', en: 'Qualities only some letters have' },
  /** Followed by the lesson's title. */
  moreInLesson: { ar: 'المزيد في درس', en: 'More in the lesson' },
  cardStateLegend: {
    ar: 'أخضر: تم التعلّم · كهرماني: بدأ التعلّم · حدّ ملوّن: الدرس التالي المقترح',
    en: 'Green: learned · Amber: started · Accent border: suggested next lesson',
  },
  // Footer and About page (#/about; src/components/Footer.tsx, AboutPage.tsx)
  aboutTitle: { ar: 'عن التطبيق', en: 'About' },
  reportIssue: { ar: 'الإبلاغ عن مشكلة', en: 'Report an issue' },
  reportByEmail: { ar: 'أو بالبريد', en: 'or by email' },
  contactEmail: { ar: 'البريد', en: 'Email' },
  githubProfile: { ar: 'حسابي على GitHub', en: 'GitHub profile' },
  sourceCode: { ar: 'الشيفرة المصدرية', en: 'Source code' },
  footerLabel: { ar: 'روابط التطبيق', en: 'App links' },
  aboutWhatTitle: { ar: 'ما هذا التطبيق', en: 'What this app is' },
  aboutWhat: {
    ar: 'دورة مجانية في التجويد للمبتدئين، برواية حفص عن عاصم، بالعربية والإنجليزية، صُنعت للأهل والأصدقاء.',
    en: 'A free beginner tajweed course in the riwayah of Hafs ʿan ʿAsim, in Arabic and English, made for family and friends.',
  },
  aboutSourcesTitle: { ar: 'المصادر والشكر', en: 'Sources and credits' },
  /** Template filled with `{reciter}` (WORD_RECITATION). */
  aboutQuranText: {
    ar: 'نص القرآن برواية حفص وأسماء السور، وتلاوة الكلمات في الرسوم بصوت {reciter}، من:',
    en: 'The Quran text (riwayah of Hafs), the surah names, and the word recitations in the clips by {reciter}, from:',
  },
  aboutAyahAudio: {
    ar: 'تلاوة الآيات في الأمثلة بصوت الشيخ مشاري العفاسي، من:',
    en: 'The ayah recitations in the examples by Sheikh Mishary Alafasy, from:',
  },
  aboutPoems: {
    ar: 'المتنان (تحفة الأطفال والمقدمة الجزرية)، من:',
    en: 'The two poems (Tuhfat al-Atfal and al-Muqaddimah al-Jazariyyah), from:',
  },
  aboutFonts: {
    ar: 'الخطوط: أميري قرآن، ونوتو نسخ عربي، ونوتو سانس، وكلها برخصة الخطوط المفتوحة من SIL:',
    en: 'Fonts: Amiri Quran, Noto Naskh Arabic and Noto Sans, via @fontsource, under the SIL Open Font License:',
  },
  aboutFontLicense: { ar: 'نص الرخصة', en: 'License text' },
  aboutReviewTitle: { ar: 'حالة المراجعة', en: 'Review status' },
  aboutReview: {
    ar: 'تُراجَع الدروس عند معلّم مُجاز في التجويد. وإلى أن يتمّ ذلك يعرض كل درس تنبيه «لم يُراجَع بعد».',
    en: 'The lessons are being checked by a qualified tajweed teacher. Until then, each lesson shows a "not yet reviewed" notice.',
  },
  aboutVersionTitle: { ar: 'الإصدار والتحديثات', en: 'Version and updates' },
  aboutContactTitle: { ar: 'تواصل وإبلاغ', en: 'Contact and reporting' },
  aboutContactHint: {
    ar: 'يحمل الإبلاغ رقم الإصدار والصفحة واللغة والمنصة فقط، ولا شيء شخصي.',
    en: 'A report carries only the app version, page, language and platform: nothing personal.',
  },
  // App version and updates (src/update/): the banner (APK only) and UpdateStatus.
  /** Template filled by formatTemplate with `{version}`, e.g. "0.2.0" (kept in Latin digits). */
  appVersion: { ar: 'الإصدار {version}', en: 'Version {version}' },
  /** Template filled by formatTemplate with `{version}`. */
  updateAvailable: { ar: 'يتوفّر إصدار جديد: {version}', en: 'A new version is available: {version}' },
  updateDownload: { ar: 'تنزيل', en: 'Download' },
  updateLater: { ar: 'لاحقًا', en: 'Later' },
  checkForUpdates: { ar: 'البحث عن تحديث', en: 'Check for updates' },
  checkingForUpdates: { ar: 'جارٍ البحث…', en: 'Checking…' },
  upToDate: { ar: 'لديك أحدث إصدار.', en: 'You have the latest version.' },
  updateCheckFailed: {
    ar: 'تعذّر البحث عن تحديث. تأكّد من اتصالك بالإنترنت ثم حاول مرة أخرى.',
    en: 'Could not check for updates. Check your internet connection and try again.',
  },
} satisfies Record<string, Bilingual>

/** Fills a `{rule}` template (e.g. `ui.quizTapPrompt`) with a rule's name, in both languages. */
export const withRuleName = (template: Bilingual, name: Bilingual): Bilingual => ({
  ar: template.ar.replace('{rule}', name.ar),
  en: template.en.replace('{rule}', name.en),
})

/**
 * Fills a template's `{name}` slots: numbers in the locale's own digits (via formatNumber, so
 * Arabic renders Arabic-Indic numerals), e.g. `ui.stepOf` → "Step 2 of 5" / "الخطوة ٢ من ٥";
 * strings (already in the locale, e.g. a surah's name) as they are.
 */
export function formatTemplate(locale: Locale, template: Bilingual, values: Record<string, number | string>): string {
  return template[locale].replace(/\{(\w+)\}/g, (slot, name: string) => {
    if (!(name in values)) return slot
    const value = values[name]
    return typeof value === 'number' ? formatNumber(locale, value) : value
  })
}

/** "3 of 20 learned" / "٣ من ٢٠ تم تعلّمها". */
export function formatLearnedCount(locale: Locale, learned: number, total: number): string {
  return formatTemplate(locale, ui.learnedCount, { learned, total })
}

/** "3 attempts" / "٣ محاولة" (see ui.attemptsCount). */
export function formatAttemptsCount(locale: Locale, count: number): string {
  return formatTemplate(locale, ui.attemptsCount, { count })
}

/** "6/8" / "٦/٨" for a quiz attempt's score, in the locale's own digits. Shared by the lesson
 *  card's grade side panel (src/components/LessonCard.tsx) and the progress page's score rows
 *  (src/components/ProgressPage.tsx) so both format a score the same way. */
export function formatScore(locale: Locale, score: { correct: number; total: number }): string {
  return `${formatNumber(locale, score.correct)}/${formatNumber(locale, score.total)}`
}
