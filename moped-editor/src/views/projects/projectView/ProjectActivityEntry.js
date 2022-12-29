import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  entryText: {
    padding: "0 0 0 .5rem",
  },
}));

const ProjectActivityEntry = ({ changeIcon, changeText }) => {
  const classes = useStyles();

  return (
    <Box display="flex" p={0}>
      <Box p={0}>
        {changeIcon}
      </Box>
      <Box p={0} flexGrow={1}>
        <Typography variant="body2" className={classes.entryText}>
          {changeText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectActivityEntry;
