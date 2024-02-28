import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatPhasesActivity = (change, phaseList, subphaseList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_phases"];

  const changeIcon = <EventNoteOutlinedIcon />;
  const phase = phaseList[change.record_data.event.data.new.phase_id];
  const subphase = subphaseList[change.record_data.event.data.new.subphase_id];
  const phaseText = {
    text: phase,
    style: "boldText",
  };
  const subphaseText = {
    text: ` - ${subphase}`,
    style: "boldText",
  };

  // add a new phase
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [
        { text: "Added ", style: null },
        phaseText,
        // include subphase name if one exists
        ...(subphase ? [subphaseText] : []),
        { text: " as a new phase", style: null },
      ],
    };
  }

  // Multiple fields in the moped_proj_phases table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  // if the record has been deleted that supersedes any other changes
  if (newRecord["is_deleted"] === true) {
    return {
      changeIcon,
      changeText: [
        { text: "Deleted the phase ", style: null },
        phaseText,
        // include subphase name if one exists
        ...(subphase ? [subphaseText] : []),
      ],
    };
  }

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

  // else render the array as a list of changed fields
  return {
    changeIcon,
    changeText: [
      { text: "Edited the phase ", style: null },
      phaseText,
      // include subphase name if one exists
      ...(subphase ? [subphaseText] : []),
      { text: " by updating the ", style: null },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ],
  };
};
