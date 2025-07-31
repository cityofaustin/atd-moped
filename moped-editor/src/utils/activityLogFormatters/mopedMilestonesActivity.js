import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { ProjectActivityLogTableMaps } from "src/views/projects/projectView/ProjectActivityLogTableMaps";

export const formatMilestonesActivity = (change, milestoneList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_milestones"];

  const changeIcon = <EventNoteOutlinedIcon />;
  const newIsDeleted = change.record_data.event.data.new.is_deleted;

  // add a new milestone
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added ", style: null },
        {
          text: milestoneList[change.record_data.event.data.new.milestone_id],
          style: "boldText",
        },
        { text: " as a new milestone", style: null },
      ],
    };
  }

  // delete an existing milestone
  if (
    change.description[0].fields.includes("is_deleted") &&
    newIsDeleted === true
  ) {
    return {
      changeIcon,
      changeText: [
        { text: "Removed the milestone ", style: null },
        {
          text: milestoneList[change.record_data.event.data.new.milestone_id],
          style: "boldText",
        },
      ],
    };
  }

  // Multiple fields in the milestones table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    if (newRecord[field] !== oldRecord[field]) {
      // filter out fields that are not listed in the activity log table maps to prevent
      // automated field updates (created at, updated at, etc.) from entering the array
      if (!!entryMap.fields[field]) {
        changes.push(entryMap.fields[field]?.label);
      }
    }
  });

  return {
    changeIcon,
    changeText: [
      { text: "Edited the milestone ", style: null },
      {
        text: milestoneList[change.record_data.event.data.new.milestone_id],
        style: "boldText",
      },
      { text: " by updating the ", style: null },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ],
  };
};
