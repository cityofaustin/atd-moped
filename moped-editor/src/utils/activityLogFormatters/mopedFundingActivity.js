import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import { ProjectActivityLogTableMaps } from "../../views/projects/projectView/ProjectActivityLogTableMaps";

export const formatFundingActivity = (change, lookupData) => {
  const entryMap = ProjectActivityLogTableMaps["moped_proj_funding"];

  const changeIcon = <MonetizationOnOutlinedIcon />;
  let changeText = "Project funding updated";

  // add a new funding source
  if (change.description.length === 0) {
    changeText = `New funding source added:  ${
      lookupData.fundingSources[change.record_data.data.new.funding_source_id]
    }`;
    return { changeText, changeIcon };
  }

  const lookupDataName = entryMap.fields[change.description[0].field]?.lookup;

  // // edit existing record
  // need to use a lookup table
  if (lookupDataName) {
    changeText = `Changed ${entryMap.fields[change.description[0].field].label}
        to "${
          lookupData[lookupDataName][
            change.description[0].new[change.description[0].field]
          ]
        }"`;
  } else {
    changeText = `
    Changed ${entryMap.fields[change.description[0].field].label} to 
    "${change.description[0].new[change.description[0].field]}"`;
  }

  // delete existing record

  return { changeText, changeIcon };
};
