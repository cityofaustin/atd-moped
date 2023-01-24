import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, lookupList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeDescription = "Project updated";
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;
  let changeValue = "";

  const changeData = change.record_data.event.data;

  // Project creation
  if (change.description.length === 0) {
    changeDescription = "Created project as ";
    changeValue = changeData.new.project_name;
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeIcon, changeDescription, changeValue };
  }

  // the field that was changed in the activity
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
        lookupList[change.description[0].new]
      }" as `;
      changeValue = entryMap.fields[changedField].label;
      return { changeIcon, changeDescription, changeValue };
    }

    // if the new field is null or undefined, its because something was removed
    if (!lookupList[changeData.new[changedField]]) {
      changeDescription = `Removed ${entryMap.fields[changedField].label} `;
      changeValue = "";
      return { changeIcon, changeDescription, changeValue };
    }

    // Changing a field, but need to use lookup table to display
    changeDescription = `Changed ${entryMap.fields[changedField].label} to `;
    changeValue = lookupList[changeData.new[changedField]];
  } else {
    // If the update is an object, show just the field name that was updated.
    if (typeof changeData.new[changedField] === "object") {
      changeDescription = `Changed ${entryMap.fields[changedField].label}`;
      changeValue = "";
      return { changeIcon, changeDescription, changeValue };
    }

    // the update can be rendered as a string
    changeDescription = `
          Changed ${entryMap.fields[changedField].label}
          to `;
    changeValue =
      changeData.new[changedField].length > 0
        ? changeData.new[changedField]
        : "(none)";
  }

  return { changeIcon, changeDescription, changeValue };
};
