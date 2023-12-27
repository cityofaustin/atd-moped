import React from "react";
import { Box, Typography, Link } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  entryText: {
    padding: "0 0 0 .5rem",
  },
  boldText: {
    fontWeight: 600,
  },
  indentText: {
    paddingLeft: "16px",
    display: "block",
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
        <Typography
          variant="body2"
          className={classes.entryText}
          component="span"
        >
          {
            // maps through the array of objects and applies specified style to the text
            changeText.map((changeObject, index) =>
              changeObject.link ? (
                <span className={classes[changeObject.style]} key={index}>
                  <Link href={changeObject.link} target="blank">
                    {changeObject.text}
                  </Link>
                </span>
              ) : (
                <span className={classes[changeObject.style]} key={index}>
                  {changeObject.text}
                </span>
              )
            )
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectActivityEntry;
