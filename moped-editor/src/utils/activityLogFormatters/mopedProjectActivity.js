import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
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
    if (!!newRecord?.[field] && typeof newRecord?.[field] === "object") {
      if (!isEqual(newRecord?.[field], oldRecord?.[field])) {
        changes.push(entryMap.fields[field]?.label);
      }
    } else if (
      newRecord?.[field] !== oldRecord?.[field] &&
      !fieldsToSkip.includes(field)
    ) {
      changes.push(entryMap.fields[field]?.label);
    }
  });

  // the only way to have more than one change in an update on the project table,
  // is if the primary and secondary names have both been updated
  const updatedFullName = changes.length > 1;

  // Get the changed fields from the description
  const changedFields = change.description[0]?.fields || [];
  const changedField = changedFields[0];

  if (!changedField) {
    return {
      changeIcon,
      changeText: [{ text: "Project updated", style: null }],
    };
  }

  // Check for eCAPRIS-related field changes using the fields array
  const hasEcaprisSyncChange = changedFields.includes(
    "should_sync_ecapris_statuses"
  );
  const hasEcaprisIdChange = changedFields.includes("ecapris_subproject_id");
  const hasEcaprisSyncAndIdChanges = hasEcaprisSyncChange && hasEcaprisIdChange;

  // Handle eCAPRIS sync changes (only sync field changed)
  if (hasEcaprisSyncChange && !hasEcaprisIdChange) {
    const newSyncValue = changeData.new.should_sync_ecapris_statuses;
    const oldSyncValue = changeData.old.should_sync_ecapris_statuses;
    const newEcaprisId = changeData.new.ecapris_subproject_id;
    const oldEcaprisId = changeData.old.ecapris_subproject_id;

    // Skip rendering activity row when syncing state changes but no eCAPRIS ID is set.
    // This edge case should only occur through direct database updates since the UI
    // prevents updating should_sync_ecapris_statuses without an eCAPRIS ID.
    if (!newEcaprisId && !oldEcaprisId) {
      return { changeIcon: null, changeText: null };
    }

    // Sync enabled
    const isSyncEnabled = newSyncValue === true && oldSyncValue === false;
    if (isSyncEnabled) {
      changeIcon = <SyncIcon />;
      return {
        changeIcon,
        changeText: [
          {
            text: "Enabled eCAPRIS subproject status sync for ",
            style: null,
          },
          { text: newEcaprisId, style: "boldText" },
        ],
      };
    }

    // Sync disabled
    const isSyncDisabled = newSyncValue === false && oldSyncValue === true;
    if (isSyncDisabled) {
      changeIcon = <SyncDisabledIcon />;
      return {
        changeIcon,
        changeText: [
          {
            text: "Disabled eCAPRIS subproject status sync for ",
            style: null,
          },
          { text: oldEcaprisId, style: "boldText" },
        ],
      };
    }
  }

  // Handle eCAPRIS ID changes when sync is enabled (only ID field changed)
  if (hasEcaprisIdChange && !hasEcaprisSyncChange) {
    const syncEnabled = changeData.new.should_sync_ecapris_statuses;
    const oldEcaprisId = changeData.old.ecapris_subproject_id;
    const newEcaprisId = changeData.new.ecapris_subproject_id;

    // eCAPRIS ID changed while sync is enabled
    if (
      syncEnabled === true &&
      oldEcaprisId &&
      newEcaprisId &&
      oldEcaprisId !== newEcaprisId
    ) {
      changeIcon = <SyncIcon />;
      return {
        changeIcon,
        changeText: [
          {
            text: "Updated eCAPRIS subproject ID and statuses sync from ",
            style: null,
          },
          { text: oldEcaprisId, style: "boldText" },
          { text: " to ", style: null },
          { text: newEcaprisId, style: "boldText" },
        ],
      };
    }
  }

  // Handle cases where both eCAPRIS fields changed in the same update
  if (hasEcaprisSyncAndIdChanges) {
    const newSyncValue = changeData.new.should_sync_ecapris_statuses;
    const newEcaprisId = changeData.new.ecapris_subproject_id;
    const oldEcaprisId = changeData.old.ecapris_subproject_id;

    // Both sync enabled and eCAPRIS ID set
    if (newSyncValue === true && newEcaprisId) {
      changeIcon = <SyncIcon />;
      return {
        changeIcon,
        changeText: [
          {
            text: "Set eCAPRIS subproject ID to  ",
            style: null,
          },
          { text: newEcaprisId, style: "boldText" },
          {
            text: " and enabled status sync ",
            style: null,
          },
        ],
      };
    }

    // Both sync disabled and eCAPRIS ID removed
    if (newSyncValue === false && !newEcaprisId && oldEcaprisId) {
      changeIcon = <SyncDisabledIcon />;
      return {
        changeIcon,
        changeText: [
          {
            text: "Removed eCAPRIS subproject ID ",
            style: null,
          },
          { text: oldEcaprisId, style: "boldText" },
          {
            text: " and disabled status sync ",
            style: null,
          },
        ],
      };
    }
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
