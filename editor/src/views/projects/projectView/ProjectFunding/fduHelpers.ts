export const FDU_ALREADY_PRESENT_MESSAGE = "FDU already present on project";

/** Build the set of FDU strings already present on the funding table
 * @param fdusArray - FDU options from the funding table rows
 */
export const getPresentFduStrings = (
  fdusArray: ({ fdu?: string | null } | null | undefined)[] | null | undefined
) => new Set((fdusArray ?? []).map((fdu) => fdu?.fdu).filter(Boolean));

/** Whether an FDU autocomplete option should be disabled because it is already on the project
 * @param option - FDU autocomplete option
 * @param presentFduStrings - FDU strings already on the funding table
 * @param currentFdu - FDU on the row being edited (kept selectable)
 */
export const isFduOptionDisabled = (
  option: { fdu?: string | null } | null | undefined,
  presentFduStrings: Set<string | null | undefined>,
  currentFdu: string | null | undefined
) =>
  Boolean(option?.fdu) &&
  presentFduStrings.has(option?.fdu) &&
  option?.fdu !== currentFdu;
