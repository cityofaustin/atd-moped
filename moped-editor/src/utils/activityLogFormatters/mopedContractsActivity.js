import AssignmentIndIconOutlined from "@mui/icons-material/AssignmentIndOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";
import {isEqual} from "lodash"

export const formatContractsActivity = (change) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_work_activity"];

  const changeIcon = <AssignmentIndIconOutlined />;
  const contractor = change.record_data.event.data.new.contractor;
  const contractorText = {
    text: contractor,
    style: "boldText",
  };

  // add a new contract
  if (change.description.length === 0) {
    if (contractor) {
      // with contractor populated
      return {
        changeIcon,
        changeText: [
          { text: "Added ", style: null },
          contractorText,
          { text: " as a new contract", style: null },
        ],
      };
    } else {
      // without contractor populated
      return {
        changeIcon,
        changeText: [{ text: "Added a new contract", style: null }],
      };
    }
  }

  // delete an existing contract
  if (change.description[0].field === "is_deleted") {
    if (contractor) {
      // with contractor populated
      return {
        changeIcon,
        changeText: [
          { text: "Removed the contract for ", style: null },
          contractorText,
        ],
      };
    } else {
      // without contractor populated
      return {
        changeIcon,
        changeText: [{ text: "Removed a contract", style: null }],
      };
    }
  }

  // Multiple fields in the moped_proj_contract table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  // loop through fields to check for differences, push label onto changes Array
  Object.keys(newRecord).forEach((field) => {
    // typeof(null) resolves as "object", check that field is not null before checking if object
    // task orders are in arrays
    if (!!newRecord[field] && typeof newRecord[field] === "object") {
      if (!isEqual(newRecord[field], oldRecord[field])) {
        changes.push(entryMap.fields[field]?.label);
      }
    } else if (newRecord[field] !== oldRecord[field] && field !== "updated_at") {
      changes.push(entryMap.fields[field]?.label);
    }
  });

  if (contractor) {
    // with contractor populated
    return {
      changeIcon,
      changeText: [
        { text: "Edited the contract for ", style: null },
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
        { text: "Edited a contract by updating the ", style: null },
        {
          text: changes.join(", "),
          style: "boldText",
        },
      ],
    };
  }
};
