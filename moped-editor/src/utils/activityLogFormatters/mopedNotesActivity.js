import SpeakerNotesOutlinedIcon from "@material-ui/icons/SpeakerNotesOutlined";
import parse from "html-react-parser";

export const formatNotesActivity = (change, entityList) => {
  const changeIcon = <SpeakerNotesOutlinedIcon />;
  const noteType = change.record_data.event.data.new.project_note_type;

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
          style: "boldIndentText",
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
