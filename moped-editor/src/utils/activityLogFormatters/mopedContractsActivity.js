import AssignmentIndIconOutlined from "@mui/icons-material/AssignmentIndOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";
import { isEqual } from "lodash";

export const formatContractsActivity = (change) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_work_activity"];

  const changeIcon = <AssignmentIndIconOutlined />;
  const contractor = change.record_data.event.data.new.contractor;
  const contractorText = {
    text: contractor,
    style: "boldText",
  };

  // add a new work activity
  if (change.description.length === 0) {
    if (contractor) {
      // with contractor populated
      return {
        changeIcon,
        changeText: [
          { text: "Added ", style: null },
          contractorText,
          { text: " as a new work activity", style: null },
        ],
      };
    } else {
      // without contractor populated
      return {
        changeIcon,
        changeText: [{ text: "Added a new work activity", style: null }],
      };
    }
  }

  // delete an existing work activity
  if (change.description[0].field === "is_deleted") {
    if (contractor) {
      // with contractor populated
      return {
        changeIcon,
        changeText: [
          { text: "Removed the work activity for ", style: null },
          contractorText,
        ],
      };
    } else {
      // without contractor populated
      return {
        changeIcon,
        changeText: [{ text: "Removed a work activity", style: null }],
      };
    }
  }

  // Multiple fields in the moped_proj_contract table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];
  const fieldsToSkip = ["updated_at", "updated_by_user_id"];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    // typeof(null) resolves as "object", check that field is not null before checking if object
    // task orders are in arrays
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

  if (contractor) {
    // with contractor populated
    return {
      changeIcon,
      changeText: [
        { text: "Edited the work activity for ", style: null },
        contractorText,
        { text: " by updating the ", style: null },
        {
          text: changes.join(", "),
          style: "boldText",
        },
      ],
    };
  } else {
    // without contractor populated
    return {
      changeIcon,
      changeText: [
        { text: "Edited a work activity by updating the ", style: null },
        {
          text: changes.join(", "),
          style: "boldText",
        },
      ],
    };
  }
};
