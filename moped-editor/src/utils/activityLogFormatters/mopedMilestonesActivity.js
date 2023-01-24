import EventNoteIcon from "@material-ui/icons/EventNote";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatMilestonesActivity = (change, milestoneList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_milestones"];

  const changeIcon = <EventNoteIcon />;
  let changeDescription = "Project milestone updated";
  let changeValue = "";

  // add a new milestone
  if (change.description.length === 0) {
    changeDescription = "Added a new milestone: ";
    changeValue = milestoneList[change.record_data.event.data.new.milestone_id];

    return { changeIcon, changeDescription, changeValue };
  }

  // delete an existing milestone
  if (change.description[0].field === "is_deleted") {
    changeDescription = "Deleted the milestone: ";
    changeValue = milestoneList[change.record_data.event.data.new.milestone_id];

    return { changeIcon, changeDescription, changeValue };
  }

  // Multiple fields in the milestones table can be updated at once
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

  // todo: add the milestone name
  changeDescription = "Edited a milestone's ";
  changeValue = changes.join(", ");

  return { changeIcon, changeDescription, changeValue };
};
