import { Button } from "@mui/material";

/**
 * Defines the NoteTypeButton with a toggle style-change behavior.
 * @param {Object} props
 * @param {number} noteTypeId - id of note type for button
 * @param {function} setFilterNoteType - function to set the filter note type state
 * @param {string} filterNoteType - id for toggled note type
 * @param {string} label - button label
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeButton = ({
  noteTypeId,
  setFilterNoteType,
  filterNoteType,
  label,
}) => (
  <Button
    color="primary"
    sx={{ margin: 2 }}
    variant={filterNoteType === noteTypeId ? "contained" : "outlined"}
    onClick={() => setFilterNoteType(noteTypeId)}
  >
    {label}
  </Button>
);

export default NoteTypeButton;
