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

  // Check for eCAPRIS-related field changes
  const hasEcaprisStatusSyncChange = changedFields.includes(
    "should_sync_ecapris_statuses"
  );
  const hasEcaprisFundingSyncChange = changedFields.includes(
    "should_sync_ecapris_funding"
  );
  const hasEcaprisIdChange = changedFields.includes("ecapris_subproject_id");

  // Extract eCAPRIS-related values
  const oldEcaprisId = changeData.old.ecapris_subproject_id;
  const newEcaprisId = changeData.new.ecapris_subproject_id;
  const statusSyncEnabled = changeData.new.should_sync_ecapris_statuses;
  const fundingSyncEnabled = changeData.new.should_sync_ecapris_funding;

  // Helper to build enabled syncs text (e.g., "status", "funding", or "status and funding")
  const getEnabledSyncsText = () => {
    const syncs = [];
    if (statusSyncEnabled) syncs.push("status");
    if (fundingSyncEnabled) syncs.push("funding");
    return syncs.join(" and ");
  };

  // Helper to determine if a sync field was toggled on or off
  const wasSyncToggled = (field) => {
    const newVal = changeData.new[field];
    const oldVal = changeData.old[field];
    if (newVal === true && oldVal === false) return "enabled";
    if (newVal === false && oldVal === true) return "disabled";
    return null;
  };

  // Handle single sync toggle (status OR funding, not both, and no ID change)
  const onlyEcaprisSyncToggled =
    (hasEcaprisStatusSyncChange || hasEcaprisFundingSyncChange) &&
    !(hasEcaprisStatusSyncChange && hasEcaprisFundingSyncChange) &&
    !hasEcaprisIdChange;

  if (onlyEcaprisSyncToggled) {
    // Skip if no eCAPRIS ID is set
    if (!newEcaprisId && !oldEcaprisId) {
      return { changeIcon: null, changeText: null };
    }

    const syncType = hasEcaprisStatusSyncChange ? "status" : "funding";
    const syncField = hasEcaprisStatusSyncChange
      ? "should_sync_ecapris_statuses"
      : "should_sync_ecapris_funding";
    const toggleState = wasSyncToggled(syncField);

    if (toggleState === "enabled") {
      return {
        changeIcon: <SyncIcon />,
        changeText: [
          {
            text: `Enabled eCAPRIS subproject ${syncType} sync from `,
            style: null,
          },
          { text: newEcaprisId, style: "boldText" },
        ],
      };
    }
    if (toggleState === "disabled") {
      return {
        changeIcon: <SyncDisabledIcon />,
        changeText: [
          {
            text: `Disabled eCAPRIS subproject ${syncType} sync from `,
            style: null,
          },
          { text: oldEcaprisId, style: "boldText" },
        ],
      };
    }
  }

  // Handle eCAPRIS ID changes (with or without sync field changes)
  if (hasEcaprisIdChange) {
    const enabledSyncsText = getEnabledSyncsText();
    const idWasSet = newEcaprisId && !oldEcaprisId;
    const idWasRemoved = !newEcaprisId && oldEcaprisId;
    const idWasChanged =
      newEcaprisId && oldEcaprisId && newEcaprisId !== oldEcaprisId;

    // ID was set for the first time
    if (idWasSet && enabledSyncsText) {
      return {
        changeIcon: <SyncIcon />,
        changeText: [
          { text: "Set eCAPRIS subproject ID to ", style: null },
          { text: newEcaprisId, style: "boldText" },
          { text: ` and enabled ${enabledSyncsText} sync`, style: null },
        ],
      };
    }

    // ID was removed
    if (idWasRemoved) {
      return {
        changeIcon: <SyncDisabledIcon />,
        changeText: [
          { text: "Removed eCAPRIS subproject ID ", style: null },
          { text: oldEcaprisId, style: "boldText" },
          { text: " and disabled status and funding sync", style: null },
        ],
      };
    }

    // ID was changed to a different value
    if (idWasChanged) {
      const changeText = [
        { text: "Updated eCAPRIS subproject ID from ", style: null },
        { text: oldEcaprisId, style: "boldText" },
        { text: " to ", style: null },
        { text: newEcaprisId, style: "boldText" },
      ];
      if (enabledSyncsText) {
        changeText.push({
          text: ` with ${enabledSyncsText} sync enabled`,
          style: null,
        });
        return { changeIcon: <SyncIcon />, changeText };
      }
      return { changeIcon, changeText };
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
