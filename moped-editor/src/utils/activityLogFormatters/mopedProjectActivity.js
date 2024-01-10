import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatProjectActivity = (change, lookupList) => {
  const entryMap = ProjectActivityLogTableMaps["moped_project"];
  let changeIcon = <span className="material-symbols-outlined">summarize</span>;

  const changeData = change.record_data.event.data;

  // Project creation
  if (change.description.length === 0) {
    changeIcon = <BeenhereOutlinedIcon />;
    return {
      changeIcon,
      changeText: [
        { text: "Created project as ", style: null },
        { text: changeData.new.project_name, style: "boldText" },
      ],
    };
  }

  // the field that was changed in the activity
  const changedField = change.description[0].field;

  if (!changedField) {
    return {
      changeIcon,
      changeText: [{ text: "Project updated", style: null }],
    };
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
      return {
        changeIcon,
        changeText: [
          {
            text: `Added ${lookupList[change.description[0].new]} as `,
            style: null,
          },
          {
            text: entryMap.fields[changedField]?.label,
            style: "boldText",
          },
        ],
      };
    }

    // if the new field is null or undefined, its because something was removed
    if (!lookupList[changeData.new[changedField]]) {
      return {
        changeIcon,
        changeText: [
          {
            text: `Removed ${entryMap.fields[changedField]?.label} `,
            style: null,
          },
        ],
      };
    }

    // Changing a field, but need to use lookup table to display
    return {
      changeIcon,
      changeText: [
        {
          text: `Changed ${entryMap.fields[changedField]?.label} to `,
          style: null,
        },
        {
          text: lookupList[changeData.new[changedField]],
          style: "boldText",
        },
      ],
    };
  }
  // we dont need the lookup table
  else {
    // If the update is an object, show just the field name that was updated.
    if (typeof changeData.new[changedField] === "object") {
      return {
        changeIcon,
        changeText: [
          {
            text: `Changed ${entryMap.fields[changedField]?.label} `,
            style: null,
          },
        ],
      };
    }

    if (changedField === "knack_project_id") {
      return {
        changeIcon,
        changeText: [
          {
            text: "Synchronized this project with the ",
            style: null,
          },
          {
            text: "Data Tracker",
            style: "boldText",
          },
        ],
      };
    }

    // the update can be rendered as a string
    const changeValue =
      // check truthiness to prevent rendering String(null) as "null"
      !!changeData.new[changedField] &&
      String(changeData.new[changedField]).length > 0
        ? changeData.new[changedField]
        : "(none)";
    return {
      changeIcon,
      changeText: [
        {
          text: `
          Changed ${entryMap.fields[changedField]?.label}
          to `,
          style: null,
        },
        {
          text: changeValue,
          style: "boldText",
        },
      ],
    };
  }
};
