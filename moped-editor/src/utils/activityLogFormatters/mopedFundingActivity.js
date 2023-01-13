import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";
import { isEqual } from "lodash";

export const formatFundingActivity = (change) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_funding"];

  const changeIcon = <MonetizationOnOutlinedIcon />;
  let changeDescription = "Project funding updated";
  let changeValue = "";

  // add a new funding source
  if (change.description.length === 0) {
    changeDescription = "Added a new funding source ";
    return { changeIcon, changeDescription, changeValue };
  }

  // delete existing record
  if (change.description[0].field === "is_deleted") {
    changeDescription = "Deleted a funding source";
    return { changeIcon, changeDescription, changeValue };
  }

  // Multiple fields in the moped_proj_funding table can be updated at once
  // We list the fields changed in the activity log, this gathers the fields changed
  const newRecord = change.record_data.event.data.new;
  const oldRecord = change.record_data.event.data.old;

  let changes = [];

  Object.keys(newRecord).forEach((field) => {
    // typeof(null) === "object"
    if (!!newRecord[field] && typeof newRecord[field] === "object") {
      if (!isEqual(newRecord[field], oldRecord[field])) {
        changes.push(entryMap.fields[field].label);
      }
    } else if (newRecord[field] !== oldRecord[field]) {
      changes.push(entryMap.fields[field].label);
    }
  });

  changeDescription = "Edited a funding source ";
  changeValue = changes.join(", ");

  return { changeIcon, changeDescription, changeValue };
};
