import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, entityList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeText = "Project updated";
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;

  let changeData = {};
  // the legacy way has the change data in event/data.
  // In the new schema, event is undefined
  const legacyVersion = !!change.record_data?.event;

  if (legacyVersion) {
    changeData = change.record_data.event.data;
  } else {
    changeData = change.record_data.data;
  }

  // project creation
  if (change.description.length === 0) {
    changeText = `${changeData.new.project_name} created`;
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeText, changeIcon };
  }

  // need to use a lookup table
  if (entryMap.fields[change.description[0].field]?.lookup) {
    // adding a new field
    if (
      change.description[0].old === null ||
      // the entity list used to use 0 as an id for null or empty
      change.description[0].old === 0 ||
      change.description[0].old[change.description[0].field] === 0
    ) {
      changeText = `
        Added "${entityList[change.description[0].new]}" as
        ${entryMap.fields[change.description[0].field].label}`;
    }

    // updating a field
    if (legacyVersion) {
      changeText = `Changed ${
        entryMap.fields[change.description[0].field].label
      } to "${entityList[change.description[0].new]}"`;
    } else {
      changeText = `Changed ${
        entryMap.fields[change.description[0].field].label
      }
        " to "
        ${entityList[change.description[0].new[change.description[0].field]]}"`;
    }
  } else {
    if (legacyVersion) {
      changeText = `
          Changed ${entryMap.fields[change.description[0].field].label}
          to "${change.description[0].new}"`;
    } else {
      changeText = `
        Changed ${entryMap.fields[change.description[0].field].label} to 
        "${change.description[0].new[change.description[0].field]}"`;
    }
  }

  return { changeText, changeIcon };
};
