import React from "react";
import { Box, Icon, Typography, makeStyles } from "@material-ui/core";
import {
  getChangeIcon,
} from "./../ProjectActivityLogTableMaps";

const useStyles = makeStyles((theme) => ({
  entryText: {
    padding: "0 0 0 .5rem",
  },
  boldText: {
    fontWeight: 700,
  }
}));

const getEntryText = (change, tagList) => {
  // Adding a new tag
  if (change.description.length === 0) {
    return `Project tagged with "${tagList[change.record_data.data.new.tag_id]}" `;
  }
  // Soft deleting a tag is the only update a user can do (is_deleted is set to true) can do
  return `"${tagList[change.record_data.data.new.tag_id]}" removed from tags`
};

const TagsActivityEntry = ({ change, tagList }) => {
  const classes = useStyles();
  const operationTypeOverride = change.operation_type === "UPDATE" ? "DELETE" : change.operation_type;
  return (
    <Box display="flex" p={0}>
      <Box p={0}>
        <Icon>{getChangeIcon(operationTypeOverride, change.record_type)}</Icon>
      </Box>
      <Box p={0} flexGrow={1}>
        <Typography variant="body2" className={classes.entryText}>
          {getEntryText(change, tagList)}
        </Typography>
      </Box>
    </Box>
  );
};


export default TagsActivityEntry;
