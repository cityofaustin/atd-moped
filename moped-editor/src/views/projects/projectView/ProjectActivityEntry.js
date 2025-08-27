import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";

const getStyleSx = (style) => {
  const baseSx = {};

  if (style === "boldText") {
    baseSx.fontWeight = 600;
  } else if (style === "indentText") {
    baseSx.paddingLeft = "16px";
    baseSx.display = "block";
  }

  return baseSx;
};
/**
 * One row/entry in the project activity log
 * @param {changeIcon} Material UI icon component
 * @param {changeText} - Array of objects of the shape:
 *  {text: String to display, style: String name of style or null}
 */
const ProjectActivityEntry = ({ changeIcon, changeText }) => {
  return (
    <Box display="flex" p={0}>
      <Box p={0}>{changeIcon}</Box>
      <Box p={0} flexGrow={1}>
        <Typography
          variant="body2"
          sx={{ padding: "0 0 0 .5rem" }}
          component="span"
        >
          {
            // maps through the array of objects and applies specified style to the text
            changeText.map((changeObject, index) =>
              changeObject.link ? (
                <Box
                  key={index}
                  component="span"
                  sx={getStyleSx(changeObject.style)}
                >
                  <Link component={RouterLink} to={changeObject.link}>
                    {changeObject.text}
                  </Link>
                </Box>
              ) : (
                <Box
                  key={index}
                  component="span"
                  sx={getStyleSx(changeObject.style)}
                >
                  {changeObject.text}
                </Box>
              )
            )
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectActivityEntry;
