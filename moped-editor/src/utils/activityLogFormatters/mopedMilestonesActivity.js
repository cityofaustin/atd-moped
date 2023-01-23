import EventNoteIcon from "@material-ui/icons/EventNote";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatMilestonesActivity = (change, milestoneList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_milestones"];

  const changeIcon = <EventNoteIcon />;
  const changeText = [];

  // add a new milestone
  if (change.description.length === 0) {
    changeText.push({ text: "Added ", style: null });
    changeText.push({
      text: milestoneList[change.record_data.event.data.new.milestone_id],
      style: "boldText",
    });
    changeText.push({ text: " as a new milestone.", style: null });

    return { changeIcon, changeText };
  }

  // delete an existing milestone
  if (change.description[0].field === "is_deleted") {
    changeText.push({ text: "Deleted the milestone ", style: null });
    changeText.push({
      text: milestoneList[change.record_data.event.data.new.milestone_id],
      style: "boldText",
    });

    return { changeIcon, changeText };
  }

  // Multiple fields in the moped_proj_funding table can be updated at once
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

  changeText.push({ text: "Edited the milestone ", style: null });
  changeText.push({
    text: milestoneList[change.record_data.event.data.new.milestone_id],
    style: "boldText",
  });
  changeText.push({ text: " by updating the ", style: null });
  changeText.push({
    text: changes.join(", "),
    style: "boldText",
  });

  return { changeIcon, changeText };
};
