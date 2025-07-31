import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

/** Fields which do not need to be rendered in the activity log */
const CHANGE_FIELDS_TO_IGNORE = [
  "updated_by_user_id",
  "created_by_user_id",
  "created_at",
  "updated_at",
];

export const formatComponentsActivity = (
  change,
  componentList,
  phaseList,
  subphaseList,
  projectId
) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_components"];

  const changeIcon = <RoomOutlinedIcon />;
  const component =
    componentList[change.record_data.event.data.new.component_id];
  const componentID = change.record_data.event.data.new.project_component_id;
  const componentLink = `/moped/projects/${projectId}?tab=map&project_component_id=${componentID}`;
  const componentText = {
    text: `${component} (#${componentID})`,
    style: "boldText",
    link: componentLink,
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
  if (change.description[0].fields.includes("is_deleted")) {
    const { link, ...simpleComponentText } = componentText;
    if (change.record_data.event.data.new.is_deleted) {
      return {
        changeIcon,
        changeText: [
          { text: "Removed a component: ", style: null },
          simpleComponentText,
        ],
      };
    }
    // if is_deleted is false, and the change is in the activity log, we restored a soft delete
    return {
      changeIcon,
      changeText: [
        { text: "Restored a deleted component: ", style: null },
        simpleComponentText,
      ],
    };
  }

  if (change.description[0].fields.includes("project_id")) {
    if (change.record_data.event.data.old.project_id === parseInt(projectId)) {
      // a component was moved from this project to another project
      return {
        changeIcon,
        changeText: [
          { text: "Moved component ", style: null },
          componentText,
          {
            text: ` to project #${change.record_data.event.data.new.project_id}`,
            style: null,
          },
        ],
      };
    } else {
      // a component was moved here from another project
      return {
        changeIcon,
        changeText: [
          { text: "Added component ", style: null },
          componentText,
          {
            text: ` from project #${change.record_data.event.data.old.project_id}`,
            style: null,
          },
        ],
      };
    }
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
        { text: "Removed the phase from component ", style: null },
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
      if (CHANGE_FIELDS_TO_IGNORE.includes(field)) {
        return;
      }
      changes.push(entryMap.fields[field]?.label);
    }
  });

  // handle an edge case where only ignored fields were edited
  if (changes.length === 0) {
    return { changeIcon: null, changeText: null };
  }

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
