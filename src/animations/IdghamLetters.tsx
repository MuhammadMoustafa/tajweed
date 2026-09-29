import { joinBilingual, type Bilingual } from "../i18n/bilingual";
import { Localized } from "../i18n/LocaleProvider";
import { LETTER_NAMES, type ArabicLetter } from "../tajweed/letters";
import { MouthDiagram, type MakhrajRegion } from "./mouth/MouthDiagram";
import type { Clip, ClipStep } from "./player/clip";

/**
 * The idgham-of-letters clips (L18): one per kind (mithlayn, mutajanisayn, mutaqaribayn), each
 * showing the first letter (with a sukun) merging into the second on MouthDiagram. Practice
 * syllables of one letter plus its harakah, never Quran text.
 */

const STEP_MS = 4500;
const MERGE_MS = 4000;

/** A letter as the clip shows it: the bare letter, what is shown big, and where it is made. */
interface Side {
  letter: ArabicLetter;
  /** Shown big: the letter with the harakah it carries in the pair. */
  text: string;
  regions: MakhrajRegion[];
}

interface Kind {
  title: Bilingual;
  first: Side;
  second: Side;
  /** The doubled letter the merge ends in. */
  result: string;
  pairLabel: Bilingual;
  pairCaption: Bilingual;
  /** Only for kinds whose two letters are made at different places. */
  secondCaption?: Bilingual;
  mergeCaption: Bilingual;
  resultCaption: Bilingual;
}

const same = (a: readonly MakhrajRegion[], b: readonly MakhrajRegion[]) =>
  a.length === b.length && a.every((r) => b.includes(r));

const FIRST_X = 200;
const SECOND_X = 100;

/**
 * The letters strip. Arabic reads right to left, so the first letter starts on the right. At
 * `progress` 0 both letters stand apart; at 1 the first has slid into the second and the doubled
 * letter stands alone.
 */
const letterStrip = (kind: Kind, progress: number) => (
  <svg className="anim-svg" viewBox="0 0 300 110" aria-hidden="true" lang="ar">
    <text
      className="anim-letter"
      x={FIRST_X - (FIRST_X - SECOND_X) * progress}
      y="80"
      textAnchor="middle"
      fill="var(--tj-silent)"
      opacity={1 - progress}
      data-part="first"
    >
      {kind.first.text}
    </text>
    <text
      className="anim-letter"
      x={SECOND_X}
      y="80"
      textAnchor="middle"
      fill="var(--text)"
      opacity={1 - progress}
      data-part="second"
    >
      {kind.second.text}
    </text>
    {progress > 0 && (
      <text
        className="anim-letter"
        x={SECOND_X}
        y="80"
        textAnchor="middle"
        fill="var(--text)"
        opacity={progress}
        data-part="result"
      >
        {kind.result}
      </text>
    )}
  </svg>
);

const frame = (
  kind: Kind,
  heading: Bilingual,
  lit: readonly MakhrajRegion[],
  names: Bilingual,
  progress: number,
) => (
  <div className="makharij-tour">
    <MouthDiagram highlight={lit} labels={lit} />
    {letterStrip(kind, progress)}
    <div className="makharij-caption">
      <strong>
        <Localized text={heading} />
      </strong>
      <span className="makharij-letter-name">
        <Localized text={names} />
      </span>
    </div>
  </div>
);

const namesOf = (...sides: Side[]): Bilingual =>
  joinBilingual(sides.map((s) => LETTER_NAMES[s.letter]));

const placeHeading = (side: Side): Bilingual => ({
  ar: `مخرج ${LETTER_NAMES[side.letter].ar}`,
  en: `Where ${LETTER_NAMES[side.letter].en} is made`,
});

function idghamClip(kind: Kind): Clip {
  const { first, second } = kind;
  const samePlace = same(first.regions, second.regions);
  const steps: ClipStep[] = [
    {
      duration: STEP_MS,
      label: kind.pairLabel,
      caption: kind.pairCaption,
      render: () =>
        samePlace
          ? frame(
              kind,
              { ar: "مخرج الحرفين", en: "Where both are made" },
              first.regions,
              namesOf(first, second),
              0,
            )
          : frame(kind, placeHeading(first), first.regions, namesOf(first), 0),
    },
  ];
  if (!samePlace && kind.secondCaption) {
    steps.push({
      duration: STEP_MS,
      label: kind.pairLabel,
      caption: kind.secondCaption,
      render: () =>
        frame(kind, placeHeading(second), second.regions, namesOf(second), 0),
    });
  }
  steps.push(
    {
      duration: MERGE_MS,
      label: { ar: "الإدغام", en: "The merge" },
      caption: kind.mergeCaption,
      render: (progress) =>
        frame(
          kind,
          { ar: "الأول يذهب في الثاني", en: "The first goes into the second" },
          second.regions,
          namesOf(first, second),
          progress,
        ),
    },
    {
      duration: STEP_MS,
      label: { ar: "النتيجة", en: "The result" },
      caption: kind.resultCaption,
      render: () =>
        frame(
          kind,
          { ar: "حرف واحد مشدَّد", en: "One doubled letter" },
          second.regions,
          namesOf(second),
          1,
        ),
    },
  );
  return { title: kind.title, steps };
}

/** Mithlayn: the same letter twice (two ba, made at the lips), the first with a sukun. */
export const idghamMithlayn: Clip = idghamClip({
  title: {
    ar: "المثلان: حرفان متماثلان",
    en: "Mithlayn: the same letter twice",
  },
  first: { letter: "ب", text: "بْ", regions: ["lip-lower", "lip-upper"] },
  second: { letter: "ب", text: "بَ", regions: ["lip-lower", "lip-upper"] },
  result: "بَّ",
  pairLabel: { ar: "المثلان", en: "Mithlayn" },
  pairCaption: {
    ar: "حرفان متماثلان في المخرج والصفات: هنا باءان. الأول ساكن (بْ) وهو الرمادي، والثاني متحرك (بَ). ومخرجهما واحد: الشفتان.",
    en: "Two letters identical in place and qualities: here, two ba. The first (grey) has a sukun, the second carries a vowel, and both come from the same place, the lips.",
  },
  mergeCaption: {
    ar: "يذهب الحرف الأول ويدخل في الثاني: لا تنطبق الشفتان مرتين، بل مرة واحدة.",
    en: "The first letter goes into the second: the lips do not close twice, only once.",
  },
  resultCaption: {
    ar: "يُنطق حرف واحد مشدَّد، كأن الشدة تجمع الحرفين. ويسمى هذا إدغامًا صغيرًا لأن الحرف الأول ساكن.",
    en: "One doubled letter is pronounced, as if a shaddah joined the two. It is called the small (saghir) kind because the first letter has a sukun.",
  },
});

/** Mutajanisayn: dal into ta, same makhraj (tongue tip and the roots of the upper teeth), different qualities. */
export const idghamMutajanisayn: Clip = idghamClip({
  title: {
    ar: "المتجانسان: مخرج واحد وصفات مختلفة",
    en: "Mutajanisayn: one place, different qualities",
  },
  first: { letter: "د", text: "دْ", regions: ["tongue-tip", "teeth-upper"] },
  second: { letter: "ت", text: "تَ", regions: ["tongue-tip", "teeth-upper"] },
  result: "تَّ",
  pairLabel: { ar: "المتجانسان", en: "Mutajanisayn" },
  pairCaption: {
    ar: "الدال والتاء يخرجان من موضع واحد: طرف اللسان مع أصول الثنايا العليا، لكن صفتهما تختلف. الدال ساكنة (الرمادية) والتاء متحركة.",
    en: "Dal and ta come from the same place, the tip of the tongue with the roots of the upper front teeth, but their qualities differ. The dal (grey) has a sukun and the ta carries a vowel.",
  },
  mergeCaption: {
    ar: "تذهب الدال في التاء: يبقى اللسان في موضعه ولا يرجع.",
    en: "The dal goes into the ta: the tongue stays where it is and does not leave and return.",
  },
  resultCaption: {
    ar: "تُنطق تاء واحدة مشدَّدة. ومثلهما الطاء والتاء، والثاء والذال والظاء، والباء والميم.",
    en: "One doubled ta is pronounced. The same happens with tah and ta, with tha, dhal and zah, and with ba and meem.",
  },
});

/** Mutaqaribayn: lam into ra, close but different makharij (both from the tongue). */
export const idghamMutaqaribayn: Clip = idghamClip({
  title: {
    ar: "المتقاربان: مخرجان متقاربان",
    en: "Mutaqaribayn: two close places",
  },
  first: {
    letter: "ل",
    text: "لْ",
    regions: ["tongue-sides", "tongue-tip", "gums"],
  },
  second: { letter: "ر", text: "رَ", regions: ["tongue-tip", "gums"] },
  result: "رَّ",
  pairLabel: { ar: "المتقاربان", en: "Mutaqaribayn" },
  pairCaption: {
    ar: "اللام: من حافة اللسان إلى طرفه مع لثة الثنايا العليا. وهي الحرف الساكن هنا (الرمادي).",
    en: "Lam: from the side of the tongue to its tip, against the gums of the upper front teeth. It is the letter with a sukun here (grey).",
  },
  secondCaption: {
    ar: "الراء: من طرف اللسان مع لثة الثنايا العليا. مخرجها قريب جدًّا من مخرج اللام لكنه ليس هو.",
    en: "Ra: from the tip of the tongue against the gums of the upper front teeth. Its place is very close to the lam’s, but not the same.",
  },
  mergeCaption: {
    ar: "تذهب اللام في الراء إدغامًا كاملًا.",
    en: "The lam goes into the ra, a complete merge.",
  },
  resultCaption: {
    ar: "تُنطق راء واحدة مشدَّدة. ومثله القاف مع الكاف، وهما من أقصى اللسان.",
    en: "One doubled ra is pronounced. Qaf into kaf works the same way; both come from the back of the tongue.",
  },
});
