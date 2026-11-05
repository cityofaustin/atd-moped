import { getPresentFduStrings, isFduOptionDisabled } from "../fduHelpers";

/**
 * Regression coverage for atd-data-tech#30040:
 * FDUs already on the funding table must be disabled in the manual FDU
 * autocomplete, except the FDU on the row currently being edited.
 */
describe("getPresentFduStrings()", () => {
  it("collects FDU strings from funding rows and skips empty values", () => {
    const fdusArray = [
      { fdu: "8600-6200-9100", ecapris_funding_id: 1 },
      null,
      { fdu: null },
      { fdu: "8600-6200-9200", ecapris_funding_id: 2 },
    ];

    expect(getPresentFduStrings(fdusArray)).toEqual(
      new Set(["8600-6200-9100", "8600-6200-9200"])
    );
  });

  it("returns an empty set when there are no funding FDUs", () => {
    expect(getPresentFduStrings(undefined)).toEqual(new Set());
    expect(getPresentFduStrings([])).toEqual(new Set());
  });
});

describe("isFduOptionDisabled()", () => {
  const present = getPresentFduStrings([
    { fdu: "8600-6200-9100" },
    { fdu: "8600-6200-9200" },
  ]);
  const alreadyPresentOption = {
    fdu: "8600-6200-9100",
    unit_long_name: "Mobility",
    ecapris_funding_id: 11,
  };
  const availableOption = {
    fdu: "8600-6200-9300",
    unit_long_name: "Signals",
    ecapris_funding_id: 12,
  };

  it("disables FDUs already present when adding a new manual row", () => {
    expect(isFduOptionDisabled(alreadyPresentOption, present, undefined)).toBe(
      true
    );
  });

  it("keeps the current row FDU selectable while editing", () => {
    expect(
      isFduOptionDisabled(alreadyPresentOption, present, "8600-6200-9100")
    ).toBe(false);
  });

  it("does not disable FDUs that are not on the project", () => {
    expect(isFduOptionDisabled(availableOption, present, undefined)).toBe(
      false
    );
  });

  it("does not disable empty options", () => {
    expect(isFduOptionDisabled(null, present, undefined)).toBe(false);
    expect(isFduOptionDisabled({ fdu: "" }, present, undefined)).toBe(false);
  });
});
