import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatComponentsActivity = (
  change,
  componentList,
  phaseList,
  subphaseList
) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_components"];

  const changeIcon = <RoomOutlinedIcon />;
  const component =
    componentList[change.record_data.event.data.new.component_id];
  const componentText = {
    text: component,
    style: "boldText",
  };
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
  const previousPhase = change.record_data.event.data.old?.phase_id;

  // add a new component
  if (change.description.length === 0) {
    return {
      changeIcon,
      changeText: [{ text: "Added a component: ", style: null }, componentText],
    };
  }

  // delete an existing component
  if (change.description[0].field === "is_deleted") {
    return {
      changeIcon,
      changeText: [
        { text: "Removed a component: ", style: null },
        componentText,
      ],
    };
  }

  // add a new component phase
  if (phase && !previousPhase) {
    return {
      changeIcon,
      changeText: [
        { text: "Added the phase ", style: null },
        phaseText,
        // include subphase name if one exists
        ...(subphase ? [subphaseText] : []),
        { text: " to component ", style: null },
        componentText,
      ],
    };
  }

  // delete an existing component phase
  if (!phase && previousPhase) {
    return {
      changeIcon,
      changeText: [
        { text: "Deleted the phase from component ", style: null },
        componentText,
      ],
    };
  }

  // Multiple fields in the moped_proj_components table can be updated at once
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
      { text: "Edited ", style: null },
      componentText,
      { text: " by updating the ", style: null },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ],
  };
};
