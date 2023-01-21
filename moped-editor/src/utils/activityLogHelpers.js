import { formatProjectActivity } from "./activityLogFormatters/mopedProjectActivity";
import { formatTagsActivity } from "./activityLogFormatters/mopedTagsActivity";
import { formatFundingActivity } from "./activityLogFormatters/mopedFundingActivity";
import { formatMilestonesActivity } from "./activityLogFormatters/mopedMilestonesActivity";
import { formatPartnersActivity } from "./activityLogFormatters/mopedPartnersActivity";


export const formatActivityLogEntry = (change, lookupData) => {
  const changeDescription = "Project was updated";
  const changeValue = "";
  const changeText = [
      {text: "Project was updated", textClassname: null}
    ];
  const changeIcon = (
    <span className="material-symbols-outlined">summarize</span>
  );

  switch (change.record_type) {
    case "moped_project":
      return formatProjectActivity(change, lookupData.entityList);
    case "moped_proj_tags":
      return formatTagsActivity(change, lookupData.tagList);
    case "moped_proj_funding":
      return formatFundingActivity(change, lookupData.fundingSources, lookupData.fundingPrograms);
    case "moped_proj_milestones":
      return formatMilestonesActivity(change, lookupData.milestoneList);
    case "moped_proj_partners":
      return formatPartnersActivity(change, lookupData.entityList);
    default:
      return { changeIcon, changeDescription, changeValue, changeText };
  }
};
