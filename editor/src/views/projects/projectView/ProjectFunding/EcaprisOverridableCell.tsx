import NotableCellPopover from "src/components/NotableCellPopover";

/**
 * Helper to determine if the eCAPRIS override indicator should be shown for a cell
 */
const getShowOverrideIndicator = ({ row, ecaprisValue, currentValue }) => {
  const hasValue = currentValue !== null && currentValue !== undefined;
  const isOverridden = ecaprisValue !== currentValue;
  return (
    hasValue && isOverridden && !row.is_manual && !row.is_synced_from_ecapris
  );
};

/**
 * NotableCellPopover wrapper that uses eCAPRIS-override rule so all cells with values sourced from
 * eCAPRIS, but can been overridden, will display the override indicator if overridden.
 */
const EcaprisOverridableCell = ({
  row,
  ecaprisValue,
  currentValue,
  displayValue,
}) => (
  <NotableCellPopover
    value={displayValue}
    isEnabled={getShowOverrideIndicator({ row, ecaprisValue, currentValue })}
    popoverText="eCAPRIS override"
  />
);

export default EcaprisOverridableCell;
