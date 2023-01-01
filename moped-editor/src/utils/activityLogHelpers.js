import BeenhereOutlinedIcon from "@material-ui/icons/BeenhereOutlined";
import { formatProjectActivity } from "./activityLogFormatters/mopedProjectActivity";
import { formatTagsActivity } from "./activityLogFormatters/mopedTagsActivity";

export const formatActivityLogEntry = (change, entityList, tagList) => {
  const changeText = "Project was updated";
  const changeIcon = <BeenhereOutlinedIcon />;

  switch (change.record_type) {
    case "moped_project":
      return formatProjectActivity(change, entityList);
    case "moped_proj_tags":
      return formatTagsActivity(change, tagList);
    case "moped_proj_funding":
      return formatFundingActivity(change);
    default:
      return { changeText, changeIcon };
  }
};
