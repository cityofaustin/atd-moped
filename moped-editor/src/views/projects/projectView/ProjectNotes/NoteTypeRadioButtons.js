import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

/**
 * Defines the NoteTypeRadioButtons that allow a user to select the note type of a
 * note they are creating or editing.
 * @param {integer} defaultValue - The note type id that determines which button option
 * should be selected/highlighted by default
 * @param {function} onChange - Callback function that runs when the note type is changed via button click
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeRadioButtons = ({ defaultValue, onChange }) => (
  <RadioGroup
    row
    value={defaultValue}
    onChange={onChange}
    sx={{ color: "black" }}
  >
    <FormControlLabel value={1} control={<Radio />} label="Internal note" />
    <FormControlLabel value={2} control={<Radio />} label="Status update" />
  </RadioGroup>
);

export default NoteTypeRadioButtons;
