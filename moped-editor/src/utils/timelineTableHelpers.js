/**
 * Phase table lookup object formatted into the shape that Dropdown expects
 * Ex: { 1: "Potential", 2: "Planned", ...}
 */
export const phaseNameLookup = (data) => {
  return data.moped_phases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.phase_id]: item.phase_name,
      }),
    {}
  );
};
