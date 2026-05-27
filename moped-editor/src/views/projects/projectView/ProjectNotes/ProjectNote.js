import {
  Grid2,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";

import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";
import SecondaryInformationChip from "src/components/SecondaryInformationChip";
import IconButtonWithTooltip from "src/components/IconButtonWithTooltip";

import "src/views/projects/projectView/ProjectNotes/ProjectNotes.css";

import {
  makeHourAndMinutesFromTimeStampTZ,
  makeUSExpandedFormDateFromTimeStampTZ,
} from "src/utils/dateAndTime";
import theme from "src/theme";

const editButtonStyles = {
  color: theme.palette.text.primary,
  "&.Mui-disabled": {
    color: theme.palette.text.disabled,
  },
};

/**
 * ProjectNote component that renders a single note in the ProjectNotes list
 * @param {Object} note - The note record to display
 * @param {number} noteIndex - The index of the note in the list
 * @param {boolean} isNoteEditable - true if the note is editable
 * @param {boolean} isEditingNote - true if the note is currently being edited
 * @param {function} handleEditClick - Callback function to handle edit button click
 * @param {function} handleDeleteOpen - Callback function to handle delete button click
 * @param {JSX.Element | string} secondary - The secondary JSX to display in the ListItemText component
 * @returns JSX.Element
 */
const ProjectNotes = ({
  note,
  noteIndex,
  isNoteEditable,
  isEditingNote,
  handleEditClick,
  handleDeleteOpen,
  secondary,
}) => {
  const phaseKey = note.phase_key;
  const phaseName = note.phase_name;
  return (
    <ListItem alignItems="flex-start">
      <ListItemText
        secondaryTypographyProps={{
          sx: editButtonStyles,
        }}
        primary={
          <>
            <Typography
              component={"span"}
              sx={{
                display: "inline",
                fontWeight: 500,
              }}
            >
              {note.author}
            </Typography>
            <Typography
              component={"span"}
              sx={{
                display: "inline",
                fontSize: ".875rem",
              }}
            >
              {` - ${makeUSExpandedFormDateFromTimeStampTZ(
                note.created_at
              )} ${makeHourAndMinutesFromTimeStampTZ(note.created_at)}`}
            </Typography>
            <Typography component={"span"}>
              {/* only show note's status badge if the note has a phase_id */}
              {phaseKey && phaseName && (
                <ProjectStatusBadge
                  phaseKey={phaseKey}
                  phaseName={phaseName}
                  condensed
                  leftMargin
                />
              )}
            </Typography>
          </>
        }
        secondary={secondary}
      />
      <ListItemSecondaryAction
        sx={{
          top: 0,
          marginTop: 3,
        }}
      >
        <Grid2 container spacing={0.5}>
          <Grid2
            sx={{
              alignItems: "center",
              display: "flex",
              marginRight: theme.spacing(1),
            }}
          >
            <SecondaryInformationChip chipLabel={note.note_type_name} />
          </Grid2>
          <Grid2>
            <IconButtonWithTooltip
              title={
                note.note_type_name === "eCAPRIS"
                  ? "Status updates from eCAPRIS can't be edited in Moped"
                  : isNoteEditable
                    ? null
                    : "Only the author can edit this note"
              }
              onClick={() => handleEditClick(noteIndex, note)}
              disabled={!isNoteEditable}
              ariaLabel="edit"
              buttonProps={{
                sx: editButtonStyles,
              }}
              icon={<EditIcon />}
            />
          </Grid2>
          <Grid2>
            {!isEditingNote && (
              <IconButtonWithTooltip
                title={
                  note.note_type_name === "eCAPRIS"
                    ? "Status updates from eCAPRIS can't be deleted in Moped"
                    : isNoteEditable
                      ? null
                      : "Only the author can delete this note"
                }
                ariaLabel="delete"
                onClick={() => handleDeleteOpen(note.original_id)}
                disabled={!isNoteEditable}
                buttonProps={{
                  sx: editButtonStyles,
                }}
                icon={<DeleteIcon />}
              />
            )}
          </Grid2>
        </Grid2>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
export default ProjectNotes;
