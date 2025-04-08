import { Button } from "@mui/material";

/**
 * Defines the NoteTypeButton with a toggle style-change behavior.
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeButton = ({
  noteTypeId,
  showButtonItemStyle,
  changeFilterNoteType,
  filterNoteType,
  label,
}) => (
  <Button
    color="primary"
    className={showButtonItemStyle}
    variant={filterNoteType === noteTypeId ? "contained" : "outlined"}
    onClick={() => changeFilterNoteType(noteTypeId)}
  >
    {label}
  </Button>
);

export default NoteTypeButton;
