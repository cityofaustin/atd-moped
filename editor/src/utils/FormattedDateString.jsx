import theme from "src/theme";
import { formatDate } from "src/utils/dateAndTime";

/**
 * A component that renders a formatted date string with primary display and optional secondary display
 * @param {Object} props - The component props
 * @param {string} props.date - The date to format, in a format parseable by new Date()
 * @param {('relative'|'absolute'|'expanded'|'short'|'time'|'fullTime')} props.primary - The format to use for the primary display
 * @param {('relative'|'absolute'|'expanded'|'short'|'time'|'fullTime')} [props.secondary] - The format to use for the secondary display, if any
 * @returns {JSX.Element} A span element containing the formatted date string(s)
 */
const FormattedDateString = ({ date, primary, secondary }) => {
  return (
    <span>
      <div>{formatDate(date, primary)}</div>
      {secondary && (
        <div style={{ fontSize: "0.8em", color: theme.palette.text.secondary }}>
          {formatDate(date, secondary)}
        </div>
      )}
    </span>
  );
};

export default FormattedDateString;
