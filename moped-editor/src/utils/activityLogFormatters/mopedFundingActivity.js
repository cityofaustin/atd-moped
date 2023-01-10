import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatFundingActivity = (change, lookupData) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_funding"];

  const changeIcon = <MonetizationOnOutlinedIcon />;
  let changeDescription = "Project funding updated";
  let changeValue = "";

  // add a new funding source
  if (change.description.length === 0) {
    changeDescription = "New funding source added: ";
    changeValue =
      lookupData.fundingSources[
        change.record_data.event.data.new.funding_source_id
      ];
    return { changeIcon, changeDescription, changeValue };
  }

  const lookupDataName = entryMap.fields[change.description[0].field]?.lookup;
  // checks config to see if change is stored in an object, as opposed to a string
  const displayObjectKey =
    entryMap.fields[change.description[0].field]?.objectKey;

  // delete existing record
  if (change.description[0].field === "is_deleted") {
    changeDescription = "Funding source was deleted";
    return { changeIcon, changeDescription, changeValue };
  }

  // editing an existing record
  // is change stored as an id?
  if (lookupDataName) {
    changeDescription = `Changed ${
      entryMap.fields[change.description[0].field].label
    } to `;
    changeValue =
      lookupData[lookupDataName][
        change.description[0].new[change.description[0].field]
      ];
    return { changeIcon, changeDescription, changeValue };
  }

  // is change stored as an object?
  if (displayObjectKey) {
    changeDescription = `Changed ${
      entryMap.fields[change.description[0].field].label
    } to `;
    changeValue =
      change.description[0].new[change.description[0].field][displayObjectKey];
  } else {
    if (change.description[0].new[change.description[0].field] === "") {
      changeDescription = `Removed ${
        entryMap.fields[change.description[0].field].label
      }`
    } else {
      changeDescription = `Changed ${
        entryMap.fields[change.description[0].field].label
      } to `;
      changeValue = change.description[0].new[change.description[0].field];
    }
  }

  return { changeIcon, changeDescription, changeValue };
};
