import React from "react";
import { Divider, Typography, Box, Grid } from "@mui/material";

const dividerSx = {
  marginTop: 2,
  marginBottom: 2,
};

const propertyItemSx = {
  marginBottom: 2,
  display: "inline-block",
  marginRight: 4,
};

const propertyLabelSx = {
  width: "100%",
  color: (theme) => theme.palette.text.secondary,
  fontSize: ".8rem",
};

const ComponentProperties = ({ component }) => {
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
