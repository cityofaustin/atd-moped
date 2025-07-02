import { Button, Tooltip } from "@mui/material";

/**
 * Defines the NoteTypeButton with a toggle style-change behavior.
 * @param {Object} props
 * @param {number} noteTypeId - id of note type for buttClickon
 * @param {function} setFilterNoteType - function to set the filter note type state
 * @param {string} filterNoteType - id for toggled note type
 * @param {string} label - button label
 * @param {boolean} isDisabled - should the button be disabled
 * @param {string} disabledMessage - message to render in tooltip if button is disabled
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeButton = ({
  noteTypeId,
  setFilterNoteType,
  filterNoteType,
  label,
  isDisabled,
  disabledMessage,
}) => {
  return (
    // Disabled buttons dont trigger user interactions so the tooltip
    // wont show unless button is wrapped in a span https://v5.mui.com/material-ui/react-tooltip/#disabled-elements
    <Tooltip title={isDisabled ? disabledMessage : ""}>
      <span>
        <Button
          color="primary"
          sx={{ margin: 2 }}
          variant={filterNoteType === noteTypeId ? "contained" : "outlined"}
          onClick={() => setFilterNoteType(noteTypeId)}
          disabled={isDisabled}
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
};

export default NoteTypeButton;
