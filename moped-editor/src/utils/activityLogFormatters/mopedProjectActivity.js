import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, entityList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeDescription = "Project updated";
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;
  let changeValue = "";

  const changeData = change.record_data.event.data;

  // project creation
  if (change.description.length === 0) {
    // created project as (bold project name)
    changeDescription = "Created project as ";
    changeValue = changeData.new.project_name;
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeIcon, changeDescription, changeValue };
  }

  const changedField = change.description[0].field;

  // need to use a lookup table
  if (entryMap.fields[changedField]?.lookup) {
    // adding new information
    if (
      changeData.old === null ||
      // the entity list used to use 0 as an id for null or empty
      changeData.old === 0 ||
      changeData.old[changedField] === 0
    ) {
      changeDescription = `Added "${
        entityList[change.description[0].new]
      }" as `;
      changeValue = entryMap.fields[changedField].label;
    }
    // Changing a field, but need to use lookup table to display
    changeDescription = `Changed ${entryMap.fields[changedField].label} to `;
    changeValue = entityList[changeData.new[changedField]];
  } else {
    // If the update is an object, show just the field name that was updated. 
    if (typeof changeData.new[changedField] === "object") {
      changeDescription = `Changed ${entryMap.fields[changedField].label}`;
      changeValue = "";
      return { changeIcon, changeDescription, changeValue };
    }
    changeDescription = `
          Changed ${entryMap.fields[changedField].label}
          to `;
    changeValue =
      changeData.new[changedField].length > 0
        ? changeData.new[changedField]
        : "(blank)";
  }

  return { changeIcon, changeDescription, changeValue };
};
