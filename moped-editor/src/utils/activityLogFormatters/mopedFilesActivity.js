import AttachFileOutlined from "@material-ui/icons/AttachFileOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatFilesActivity = (change) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project_files"];

  const changeIcon = <AttachFileOutlined />;
  const oldFileName = change.record_data.event.data.old?.file_name;
  const newFileName = change.record_data.event.data.new.file_name;
  const fileText = {
    // if there is no old file name (previous state where file name did not exist),
    // display current file name, otherwise displays old file name that was changed
    text: !oldFileName ? newFileName : oldFileName,
    style: "boldText",
  };

  // add a new file
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added ", style: null },
        fileText,
        { text: " as a new file", style: null },
      ],
    };
  }

  // delete an existing file
  if (change.description[0].field === "is_deleted") {
    return {
      changeIcon,
      changeText: [{ text: "Deleted the file ", style: null }, fileText],
    };
  }

  // Multiple fields in the moped_proj_files table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    if (newRecord[field] !== oldRecord[field]) {
      changes.push(entryMap.fields[field]?.label);
    }
  });

  return {
    changeIcon,
    changeText: [
      { text: "Edited the file ", style: null },
      fileText,
      { text: " by updating the ", style: null },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ],
  };
};
