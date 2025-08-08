import React from "react";
import { Divider, Typography, Box, Grid } from "@mui/material";

const ComponentProperties = ({ component }) => {
  // Reusable sx objects for better maintainability
  const dividerSx = {
    marginTop: (theme) => theme.spacing(2),
    marginBottom: (theme) => theme.spacing(2),
  };

  const propertyItemSx = {
    marginBottom: (theme) => theme.spacing(2),
    display: "inline-block",
    marginRight: (theme) => theme.spacing(4),
  };

  const propertyLabelSx = {
    width: "100%",
    color: (theme) => theme.palette.text.secondary,
    fontSize: ".8rem",
  };

  return (
    <>
      <Divider sx={dividerSx} />
      <Grid item xs={12} sx={propertyItemSx}>
        <Typography sx={propertyLabelSx}>Component ID</Typography>
        <Box>
          <Typography>{component.projectComponentId}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sx={propertyItemSx}>
        <Typography sx={propertyLabelSx}>Council district(s)</Typography>
        <Box>
          <Typography>{component.councilDistrict}</Typography>
        </Box>
      </Grid>
      {component.componentLength > 0 && (
        <Grid item xs={12} sx={propertyItemSx}>
          <Typography sx={propertyLabelSx}>Length</Typography>
          <Box>
            <Typography>
              {component.componentLength.toLocaleString()}'
            </Typography>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default ComponentProperties;
