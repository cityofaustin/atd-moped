import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";
import { isEqual } from "lodash";

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

  const getRemovedField = (changedField) => {
    // for removed fields use lookup data if available, otherwise use raw field data
    return {
      changeIcon,
      changeText: [
        {
          text: `Removed ${entryMap.fields[changedField]?.label} `,
          style: null,
        },
        {
          text: entryMap.fields[changedField]?.lookup
            ? lookupList[changeData.old[changedField]]
            : changeData.old[changedField],
          style: "boldText",
        },
      ],
    };
  };

  const newRecord = changeData.new;
  const oldRecord = changeData.old;
  let changes = [];
  const fieldsToSkip = [
    "updated_at",
    "updated_by_user_id",
    "project_name_full",
  ];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    // typeof(null) === "object", check that field is not null before checking if object
    if (!!newRecord[field] && typeof newRecord[field] === "object") {
      if (!isEqual(newRecord[field], oldRecord[field])) {
        changes.push(entryMap.fields[field]?.label);
      }
    } else if (
      newRecord[field] !== oldRecord[field] &&
      !fieldsToSkip.includes(field)
    ) {
      changes.push(entryMap.fields[field]?.label);
    }
  });

  // the only way to have more than one change in an update on the project table,
  // is if the primary and secondary names have both been updated
  const updatedFullName = changes.length > 1;

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

    // if the new field value is null or undefined, its because something was removed
    if (!lookupList[changeData.new[changedField]]) {
      return getRemovedField(changedField);
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
  } else {
    // If the update is an object, check first for a null object
    if (typeof changeData.new[changedField] === "object") {
      // if the new field is null, it is because something was removed
      if (lookupList[changeData.new[changedField]] === null) {
        return getRemovedField(changedField);
        // if the update truly is an object, show just the field name that was updated
      } else {
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

    // if both the project name and secondary name fields were updated
    if (updatedFullName) {
      return {
        changeIcon,
        changeText: [
          {
            text: "Changed full project name to ",
            style: null,
          },
          {
            text: changeData.new["project_name_full"],
            style: "boldText",
          },
        ],
      };
    }

    // if only the name field was updated, the project name full field is still changed
    // but this was due to the name being updated
    if (changedField === "project_name_full") {
      return {
        changeIcon,
        changeText: [
          {
            text: "Changed project name to ",
            style: null,
          },
          {
            text: changeData.new["project_name"],
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
