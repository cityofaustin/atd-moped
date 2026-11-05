import { getContrastRatio } from "@mui/material";
import { styleMapping } from "../phases";

const WCAG_AA_MIN_CONTRAST = 4.5;

const getChipContrast = (phaseKey) => {
  const { color, background } = styleMapping[phaseKey];
  return getContrastRatio(color, background);
};

const phasesMeetingAA = ["potential", "on_hold", "construction", "default"];

/**
 * Known gaps: white text on green, blue or red chips.
 * When one of these is fixed, its test fails. Move it to phasesMeetingAA.
 */
const phasesBelowAA = [
  "planned",
  "preliminary_engineering",
  "scoping",
  "preliminary_design",
  "design",
  "pre_construction",
  "bid_award_execution",
  "construction_ready",
  "post_construction",
  "canceled",
  "complete",
];

/**
 * Regression coverage for atd-data-tech#30875:
 * "Potential" and "On hold" chips must keep readable text.
 */
describe("phase chip text contrast", () => {
  it.each(phasesMeetingAA)("%s meets WCAG AA", (phaseKey) => {
    expect(getChipContrast(phaseKey)).toBeGreaterThanOrEqual(
      WCAG_AA_MIN_CONTRAST
    );
  });

  it.fails.each(phasesBelowAA)("%s is a known gap", (phaseKey) => {
    expect(getChipContrast(phaseKey)).toBeGreaterThanOrEqual(
      WCAG_AA_MIN_CONTRAST
    );
  });

  it("checks every phase, so a new phase can't skip this test", () => {
    expect([...phasesMeetingAA, ...phasesBelowAA].sort()).toEqual(
      Object.keys(styleMapping).sort()
    );
  });
});
