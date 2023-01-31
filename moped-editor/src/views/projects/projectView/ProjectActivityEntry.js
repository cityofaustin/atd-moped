import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  entryText: {
    padding: "0 0 0 .5rem",
  },
  boldText: {
    fontWeight: 600,
  },
}));

/**
 * One row/entry in the project activity log
 * @param {changeIcon} Material UI icon component
 * @param {changeText} - Array of objects of the shape:
 *  {text: String to display, style: String name of style or null}
 */
const ProjectActivityEntry = ({ changeIcon, changeText }) => {
  const classes = useStyles();
  return (
    <Box display="flex" p={0}>
      <Box p={0}>{changeIcon}</Box>
      <Box p={0} flexGrow={1}>
        <Typography variant="body2" className={classes.entryText}>
          {
            // maps through the array of objects and applies specified style to the text
            changeText.map((changeObject, index) => (
              <span className={classes[changeObject.style]} key={index}>
                {changeObject.text}
              </span>
            ))
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectActivityEntry;
