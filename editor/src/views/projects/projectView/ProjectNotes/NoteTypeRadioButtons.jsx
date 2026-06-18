import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

/**
 * Defines the NoteTypeRadioButtons that allow a user to select the note type of a
 * note they are creating or editing.
 * @param {integer} defaultValue - The note type id that determines which button option
 * should be selected/highlighted by default
 * @param {function} onChange - Callback function that runs when the note type is changed via button click
 * @param {Array|objects} noteTypes - Array of moped_note_type objects containing id, name and slug
 * @return {JSX.Element}
 * @constructor
 */
const NoteTypeRadioButtons = ({ defaultValue, onChange, noteTypes }) => (
  <RadioGroup
    row
    value={defaultValue}
    onChange={onChange}
    sx={{ color: "black" }}
  >
    {noteTypes
      .filter((type) => type.source !== "ecapris")
      .map((type) => (
        <FormControlLabel
          value={type.id}
          control={<Radio />}
          label={type.name}
          key={type.slug}
        />
      ))}
  </RadioGroup>
);

export default NoteTypeRadioButtons;
