import React from "react";
import { Divider, Typography, Box, Grid2 } from "@mui/material";

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
      <Grid2 sx={propertyItemSx} size={12}>
        <Typography sx={propertyLabelSx}>Component ID</Typography>
        <Box>
          <Typography>{component.projectComponentId}</Typography>
        </Box>
      </Grid2>
      <Grid2 sx={propertyItemSx} size={12}>
        <Typography sx={propertyLabelSx}>Council district(s)</Typography>
        <Box>
          <Typography>{component.councilDistrict}</Typography>
        </Box>
      </Grid2>
      {component.componentLength > 0 && (
        <Grid2 sx={propertyItemSx} size={12}>
          <Typography sx={propertyLabelSx}>Length</Typography>
          <Box>
            <Typography>
              {component.componentLength.toLocaleString()}'
            </Typography>
          </Box>
        </Grid2>
      )}
    </>
  );
};

export default ComponentProperties;
