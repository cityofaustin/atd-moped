import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, entityList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;
  let changeText = [];

  const changeData = change.record_data.event.data;

  // Project creation
  if (change.description.length === 0) {
    changeText.push({ text: "Created project as ", style: null });
    changeText.push({ text: changeData.new.project_name, style: "boldText" });
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeIcon, changeText };
  }

  // the field that was changed in the activity
  const changedField = change.description[0].field;

  if (!changedField) {
    changeText.push({ text: "Project updated", style: null });
    return { changeIcon, changeText };
  }

  // need to use a lookup table
  if (entryMap.fields[changedField]?.lookup) {
    // adding new information
    if (
      changeData.old === null ||
      // the entity list used to use 0 as an id for null or empty
      changeData.old === 0 ||
      changeData.old[changedField] === 0
    ) {
      changeText.push({
        text: `Added "${entityList[change.description[0].new]}" as `,
        style: null,
      });
      changeText.push({
        text: entryMap.fields[changedField].label,
        style: "boldText",
      });

      return { changeIcon, changeText };
    }

    // if the new field is null or undefined, its because something was removed
    if (!entityList[changeData.new[changedField]]) {
      changeText.push({
        text: `Removed ${entryMap.fields[changedField].label} `,
        style: null,
      });
      return { changeIcon, changeText };
    }

    // Changing a field, but need to use lookup table to display
    changeText.push({
      text: `Changed "${entryMap.fields[changedField].label}" to `,
      style: null,
    });
    changeText.push({
      text: entityList[changeData.new[changedField]],
      style: "boldText",
    });
  }
  // we dont need the lookup table
  else {
    // If the update is an object, show just the field name that was updated.
    if (typeof changeData.new[changedField] === "object") {
      changeText.push({
        text: `Changed ${entryMap.fields[changedField].label} `,
        style: null,
      });
      return { changeIcon, changeText };
    }

    // the update can be rendered as a string
    const changeValue =
      String(changeData.new[changedField]).length > 0
        ? changeData.new[changedField]
        : "(none)";

    changeText.push({
      text: `
          Changed ${entryMap.fields[changedField].label}
          to `,
      style: null,
    });
    changeText.push({
      text: changeValue,
      style: "boldText",
    });
  }
  return { changeIcon, changeText };
};
