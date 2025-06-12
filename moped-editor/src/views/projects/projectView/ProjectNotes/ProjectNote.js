import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";

import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";

import "src/views/projects/projectView/ProjectNotes/ProjectNotes.css";

import {
  makeHourAndMinutesFromTimeStampTZ,
  makeUSExpandedFormDateFromTimeStampTZ,
} from "src/utils/dateAndTime";
import theme from "src/theme";

const editButtonStyles = {
  color: theme.palette.text.primary,
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
      <ListItemAvatar>
        <Avatar />
      </ListItemAvatar>
      <ListItemText
        sx={
          isNoteEditable
            ? {
                marginRight: "30px",
              }
            : {}
        }
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
            <Typography
              component={"span"}
              sx={{
                display: "inline",
                marginLeft: "12px",
                color: theme.palette.primary.main,
                textTransform: "uppercase",
                fontSize: ".875rem",
                fontWeight: 500,
              }}
            >
              {note.note_type_name}
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
      {isNoteEditable && (
        <ListItemSecondaryAction
          sx={{
            top: "0%",
            marginTop: "25px",
          }}
        >
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => handleEditClick(noteIndex, note)}
            size="large"
          >
            <EditIcon sx={editButtonStyles} />
          </IconButton>
          {!isEditingNote && (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteOpen(note.project_note_id)}
              size="large"
            >
              <DeleteIcon sx={editButtonStyles} />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default ProjectNotes;
