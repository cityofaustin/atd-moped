import { formatProjectActivity } from "./activityLogFormatters/mopedProjectActivity";
import { formatTagsActivity } from "./activityLogFormatters/mopedTagsActivity";

export const formatActivityLogEntry = (change, lookupData) => {
  const changeText = "Project was updated";
  const changeIcon = <span className="material-symbols-outlined">summarize</span>;;

  switch (change.record_type) {
    case "moped_project":
      return formatProjectActivity(change, lookupData.entityList);
    case "moped_proj_tags":
      return formatTagsActivity(change, lookupData.tagList);
    default:
      return { changeText, changeIcon };
  }
};
