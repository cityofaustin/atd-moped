import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";
import { isEqual } from "lodash";

const getFundingSourceIdText = (newRecord, fundingSources, fundingPrograms) => {
  if (!newRecord || !fundingSources || !fundingPrograms) {
    return;
  }
  if (newRecord.funding_source_id) {
    return fundingSources?.[newRecord.funding_source_id];
  } else if (newRecord.funding_program_id) {
    return fundingPrograms?.[newRecord.funding_program_id];
  } else {
    return;
  }
};

export const formatFundingActivity = (
  change,
  fundingSources,
  fundingPrograms
) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_funding"];

  const changeIcon = <MonetizationOnOutlinedIcon />;

  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  const fundingSourceText = getFundingSourceIdText(
    newRecord,
    fundingSources,
    fundingPrograms
  );

  // add a new funding source
  if (change.description.length === 0) {
    // if the added record has a funding source, use that as the change value
    if (fundingSourceText) {
      return {
        changeIcon,
        changeText: [
          { text: "Added ", style: null },
          {
            text: fundingSourceText,
            style: "boldText",
          },
          { text: " as a new funding source", style: null },
        ],
      };
    } else {
      return {
        changeIcon,
        changeText: [{ text: "Added a new funding source", style: null }],
      };
    }
  }
  // delete an existing record
  if (change.description[0].fields.includes("is_deleted")) {
    if (fundingSourceText) {
      return {
        changeIcon,
        changeText: [
          { text: "Removed a funding source: ", style: null },
          {
            text: fundingSourceText,
            style: "boldText",
          },
        ],
      };
    } else {
      return {
        changeIcon,
        changeText: [{ text: "Removed a funding source", style: null }],
      };
    }
  }

  // Multiple fields in the moped_proj_funding table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  let changes = [];
  const fieldsToSkip = ["updated_at", "updated_by_user_id"];

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

  let changeText;
  if (fundingSourceText) {
    changeText = [
      {
        text: "Edited funding source ",
        style: null,
      },
      {
        text: fundingSourceText,
        style: "boldText",
      },
      {
        text: " by updating the ",
        style: null,
      },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ];
  } else {
    changeText = [
      {
        text: "Edited a funding source by updating the ",
        style: null,
      },
      {
        text: changes.join(", "),
        style: "boldText",
      },
    ];
  }

  return {
    changeIcon,
    changeText,
  };
};
