import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, entityList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeDescription = "Project updated";
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;
  let changeText = [{ text: "Project updated", style: null }];

  const changeData = change.record_data.event.data;

  // Project creation
  if (change.description.length === 0) {
    changeText = [
      { text: "Created project as ", style: null },
      { text: changeData.new.project_name, style: "boldText" },
    ];
    changeIcon = <BeenhereOutlinedIcon />;
    return { changeIcon, changeText };
  }

  // the field that was changed in the activity
  const changedField = change.description[0].field;

  if (!changedField) {
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
      changeText = [
        {
          text: `Added "${entityList[change.description[0].new]}" as `,
          style: null,
        },
        { text: entryMap.fields[changedField].label, style: "boldText" },
      ];

      return { changeIcon, changeText };
    }

    // if the new field is null or undefined, its because something was removed
    if (!entityList[changeData.new[changedField]]) {
      changeText = [
        {
          text: `Removed ${entryMap.fields[changedField].label} `,
          style: null,
        },
      ];
      return { changeIcon, changeText };
    }

    // Changing a field, but need to use lookup table to display
    changeText = [
      {
        text: `Changed "${entryMap.fields[changedField].label}" to `,
        style: null,
      },
      { text: entityList[changeData.new[changedField]], style: "boldText" },
    ];
  }
  // we dont need the lookup table
  else {
    // If the update is an object, show just the field name that was updated.
    if (typeof changeData.new[changedField] === "object") {
      changeText = [
        {
          text: `Changed ${entryMap.fields[changedField].label} `,
          style: null,
        },
      ];
      return { changeIcon, changeText };
    }

    // the update can be rendered as a string
    const changeValue =
      String(changeData.new[changedField]).length > 0
        ? changeData.new[changedField]
        : "(none)";

    changeText = [
      {
        text: `
          Changed ${entryMap.fields[changedField].label}
          to `,
        style: null,
      },
      {
        text: changeValue,
        style: "boldText",
      },
    ];
  }
  return { changeIcon, changeText };
};
