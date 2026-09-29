import { act, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { formatNumber } from "../i18n/bilingual";
import { ui } from "../i18n/ui";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { LESSONS } from "../lessons";
import { splitByLevel, UNITS } from "../lessons/units";
import { recordQuizAttempt, setLessonLearned } from "../progress";
import { LessonList } from "./LessonList";

const renderList = () => {
  const { container } = render(
    <LocaleProvider>
      <LessonList />
    </LocaleProvider>,
  );
  return { container, screen: within(container) };
};

// The state classes live on the card container, not the link inside it (no nested links: the
// container is a plain div with the lesson link and the quiz side panel as separate children).
const cardFor = (container: HTMLElement, lessonId: string) =>
  container
    .querySelector(`a[href="#/lesson/${lessonId}"]`)
    ?.closest(".lesson-card");

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("LessonList", () => {
  it('shows a "0 of N learned" summary with nothing learned yet', () => {
    const { screen } = renderList();
    expect(
      screen.getByText(`0 of ${splitByLevel(LESSONS).core.length} learned`),
    ).toBeInTheDocument();
  });

  it("shows a check plus accessible text, and updates the count, once a lesson is marked learned", () => {
    const lesson = LESSONS[0];
    const { screen, container } = renderList();

    act(() => {
      setLessonLearned(lesson.id, true);
    });

    expect(
      screen.getByText(`1 of ${splitByLevel(LESSONS).core.length} learned`),
    ).toBeInTheDocument();
    // Not color alone: a check glyph plus screen-reader text name the state.
    expect(container.querySelector(".learned-check")).not.toBeNull();
    expect(
      screen.getByText("Learned", { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });

  it("formats the count with Arabic-Indic digits in Arabic", () => {
    localStorage.setItem("tajweed.locale", "ar");
    const { screen } = renderList();
    const expectedTotal = formatNumber("ar", splitByLevel(LESSONS).core.length);
    expect(
      screen.getByText(`٠ من ${expectedTotal} تم تعلّمها`),
    ).toBeInTheDocument();
  });

  it('marks the first not-learned lesson as "next", with a plain not-started card otherwise', () => {
    const { container } = renderList();
    const firstCard = cardFor(container, LESSONS[0].id);
    expect(firstCard).toHaveClass("is-next");
    expect(firstCard).toHaveClass("is-not-started");
    expect(container.querySelectorAll(".lesson-list .is-next")).toHaveLength(1);
  });

  it('gives a lesson with an attempt (but not learned) the "started" state and a badge, not learned', () => {
    const lesson = LESSONS[0];
    recordQuizAttempt(lesson.id, "easy", [{ correct: true }]);
    const { container } = renderList();

    const card = cardFor(container, lesson.id);
    expect(card).toHaveClass("is-started");
    expect(card).not.toHaveClass("is-learned");
    expect(card?.querySelector(".card-badge.started")).not.toBeNull();
  });

  it('gives a learned lesson the "learned" state even if it also has attempts, and moves "next" on', () => {
    const [first, second] = LESSONS;
    recordQuizAttempt(first.id, "easy", [{ correct: true }]);
    setLessonLearned(first.id, true);
    const { container } = renderList();

    const firstCard = cardFor(container, first.id);
    expect(firstCard).toHaveClass("is-learned");
    expect(firstCard).not.toHaveClass("is-next");

    if (second) {
      const secondCard = cardFor(container, second.id);
      expect(secondCard).toHaveClass("is-next");
    }
  });

  // One test per unit and language: rendering the whole list 2 × (number of units) times in one
  // test outgrew the 5 s timeout under load as units were added.
  const unitCases = Object.entries(UNITS).flatMap(([unitId, unit]) =>
    (["en", "ar"] as const).map((locale) => [unitId, locale, unit] as const),
  );
  it.each(unitCases)("nests unit %s's lessons under its heading (%s)", (unitId, locale, unit) => {
    const members = LESSONS.filter((l) => l.unit === unitId);
    if (members.length === 0) return; // declared before its lessons land
    localStorage.setItem("tajweed.locale", locale);
    const { container } = render(
      <LocaleProvider>
        <LessonList />
      </LocaleProvider>,
    );
    const group = container.querySelector(`.lesson-unit[data-unit="${unitId}"]`)!;
    expect(group.querySelector("summary .lesson-unit-title")).toHaveTextContent(unit.title[locale]);
    expect(group.querySelector("summary .lesson-unit-number")).toHaveTextContent(formatNumber(locale, unit.order));
    expect(within(group as HTMLElement).getByRole("list", { name: unit.title[locale] })).toBeInTheDocument();
    const links = [...group.querySelectorAll(".lesson-unit-chapters .lesson-card-main")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(members.map((l) => `#/lesson/${l.id}`));
  });

  it("opens only the unit holding the next lesson, and keeps that choice when progress changes", () => {
    const { container } = renderList();
    const openUnits = () =>
      [...container.querySelectorAll(".lesson-unit details[open]")].map((d) =>
        d.closest(".lesson-unit")?.getAttribute("data-unit"),
      );
    expect(openUnits()).toEqual([LESSONS[0].unit]);
    // Learning the whole first unit moves "next" on, but the open state is not forced again.
    act(() => {
      for (const l of LESSONS.filter((x) => x.unit === LESSONS[0].unit))
        setLessonLearned(l.id, true);
    });
    expect(openUnits()).toEqual([LESSONS[0].unit]);
  });

  it("shows each unit's progress in the locale's digits", () => {
    const first = LESSONS.filter((l) => l.unit === LESSONS[0].unit);
    setLessonLearned(first[0].id, true);
    for (const locale of ["en", "ar"] as const) {
      localStorage.setItem("tajweed.locale", locale);
      const { container, unmount } = render(
        <LocaleProvider>
          <LessonList />
        </LocaleProvider>,
      );
      const progress = container.querySelector(
        ".lesson-unit summary .lesson-unit-progress",
      )!;
      const learned = formatNumber(locale, 1);
      const total = formatNumber(locale, first.length);
      expect(progress.textContent).toBe(
        locale === "en"
          ? `${learned} of ${total} learned`
          : `${learned} من ${total} تم تعلّمها`,
      );
      unmount();
    }
  });

  it("shows a legend explaining the card colors", () => {
    const { container } = renderList();
    expect(container.querySelector(".legend")).not.toBeNull();
  });

  it("shows the advanced units under their own heading, in both languages, after the core units", () => {
    const advancedUnits = Object.entries(UNITS).filter(
      ([, u]) => u.level === "advanced",
    );
    for (const locale of ["en", "ar"] as const) {
      localStorage.setItem("tajweed.locale", locale);
      const { container, unmount } = render(
        <LocaleProvider>
          <LessonList />
        </LocaleProvider>,
      );
      const section = container.querySelector(".advanced-section")!;
      expect(section.querySelector("h3")).toHaveTextContent(
        ui.advancedHeading[locale],
      );
      expect(section).toHaveTextContent(ui.advancedNote[locale]);
      for (const [id] of advancedUnits) {
        expect(
          section.querySelector(`.lesson-unit[data-unit="${id}"]`),
        ).not.toBeNull();
        expect(
          container.querySelectorAll(`.lesson-unit[data-unit="${id}"]`),
        ).toHaveLength(1);
      }
      expect(
        container.querySelectorAll(".advanced-section .lesson-unit"),
      ).toHaveLength(advancedUnits.length);
      unmount();
    }
  });

  it('never marks an advanced lesson "next" while a core lesson is unlearned', () => {
    const { container } = renderList();
    expect(
      container.querySelectorAll(".advanced-section .is-next"),
    ).toHaveLength(0);
  });
});
