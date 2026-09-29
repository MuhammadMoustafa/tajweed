import { useId, useState } from "react";
import { useLocale } from "../i18n/LocaleProvider";
import { formatLearnedCount, formatTemplate, ui } from "../i18n/ui";
import type { Lesson } from "../lessons/types";
import { LESSONS } from "../lessons";
import { groupByUnit, nextLesson, splitByLevel, UNITS } from "../lessons/units";
import { useProgress } from "../progress";
import { LessonCard } from "./LessonCard";

/** Color is never the only signal: each lesson-card state below also has a text badge or
 *  sr-only label (see the map in LessonCard). This legend names what the colors mean. */
function CardStateLegend() {
  const { t } = useLocale();
  return (
    <aside className="legend" aria-label={t(ui.cardStateLegend)}>
      <ul>
        <li>
          <span className="swatch state-swatch is-learned" aria-hidden="true" />
          {t(ui.markedAsLearned)}
        </li>
        <li>
          <span className="swatch state-swatch is-started" aria-hidden="true" />
          {t(ui.cardStateStarted)}
        </li>
        <li>
          <span className="swatch state-swatch is-next" aria-hidden="true" />
          {t(ui.nextLessonBadge)}
        </li>
      </ul>
    </aside>
  );
}

export function LessonList() {
  const { locale, t } = useLocale();
  const { isLearned, cardState } = useProgress();
  const idPrefix = useId();
  // The next lesson to take: the first not-learned core lesson; advanced only once core is done.
  const nextId = nextLesson(LESSONS, isLearned)?.id;
  // The unit holding the next lesson starts open, the rest closed. Fixed at first render, so a
  // unit the learner opens or closes stays as they left it when progress changes.
  const [initiallyOpen] = useState(
    () => LESSONS.find((lesson) => lesson.id === nextId)?.unit,
  );
  const { core, advanced } = splitByLevel(LESSONS);
  const learnedIn = (lessons: readonly Lesson[]) =>
    lessons.filter((l) => isLearned(l.id)).length;

  const renderGroups = (lessons: readonly Lesson[]) =>
    groupByUnit(lessons).map((group) => {
      const cards = group.lessons.map((lesson) => (
        <li key={lesson.id}>
          <LessonCard
            lesson={lesson}
            state={cardState(lesson.id)}
            isNext={lesson.id === nextId}
          />
        </li>
      ));
      if (group.unit === undefined) return cards;
      // A unit: a native <details> (keyboard and screen-reader support for free) whose summary
      // shows its number, title and progress, then its lessons as a nested list of the same cards.
      const unit = UNITS[group.unit];
      const learned = learnedIn(group.lessons);
      const titleId = `${idPrefix}unit-${group.unit}`;
      return (
        <li key={titleId} className="lesson-unit" data-unit={group.unit}>
          <details open={group.unit === initiallyOpen}>
            <summary>
              <span className="lesson-unit-heading">
                <span className="lesson-unit-number">
                  {formatTemplate(locale, ui.unitNumber, { n: unit.order })}
                </span>
                <strong id={titleId} className="lesson-unit-title">
                  {t(unit.title)}
                </strong>
              </span>
              <span className="lesson-unit-progress">
                {formatLearnedCount(locale, learned, group.lessons.length)}
              </span>
            </summary>
            <ol
              className="lesson-list lesson-unit-chapters"
              aria-labelledby={titleId}
            >
              {cards}
            </ol>
          </details>
        </li>
      );
    });

  return (
    <section>
      <h2>{t(ui.lessons)}</h2>
      <p className="progress-summary">
        {formatLearnedCount(locale, learnedIn(core), core.length)}
      </p>
      <CardStateLegend />
      <ol className="lesson-list">{renderGroups(core)}</ol>
      {advanced.length > 0 && (
        <section
          className="advanced-section"
          aria-labelledby={`${idPrefix}advanced`}
        >
          <h3 id={`${idPrefix}advanced`}>{t(ui.advancedHeading)}</h3>
          <p className="progress-summary advanced-note">{t(ui.advancedNote)}</p>
          <p className="progress-summary advanced-count">
            {formatLearnedCount(locale, learnedIn(advanced), advanced.length)}
          </p>
          <ol className="lesson-list">{renderGroups(advanced)}</ol>
        </section>
      )}
    </section>
  );
}
