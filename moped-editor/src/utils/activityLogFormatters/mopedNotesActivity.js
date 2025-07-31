import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import parse from "html-react-parser";

export const formatNotesActivity = (change, entityList) => {
  const changeIcon = <SpeakerNotesOutlinedIcon />;
  const noteType = change.record_data.event.data.new.project_note_type;
  const newIsDeleted = change.record_data.event.data.new.is_deleted;

  // Adding a new note
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        {
          text: noteType === 2 ? "Added a status update " : "Added a comment ",
          style: null,
        },
        {
          text: parse(change.record_data.event.data.new.project_note),
          style: "indentText",
        },
      ],
    };
  }

  if (
    change.description[0].fields.includes("is_deleted") &&
    newIsDeleted === true
  ) {
    return {
      changeIcon,
      changeText: [
        {
          text:
            noteType === 2 ? "Removed a status update " : "Removed a comment ",
          style: null,
        },
      ],
    };
  }

  return {
    changeIcon,
    changeText: [
      {
        text: noteType === 2 ? "Edited a status update " : "Edited a comment ",
        style: null,
      },
    ],
  };
};
