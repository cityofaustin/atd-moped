import React from "react";
import { Divider, Typography, Box, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  dividerSpacing: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  propertyItem: {
    marginBottom: theme.spacing(3),
  },
  propertyLabel: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".8rem",
  },
  propertyLabelText: {},
}));

const ComponentProperties = ({ component }) => {
  const classes = useStyles();

  console.log(component);
  return (
    <>
      <Divider className={classes.dividerSpacing} />
      <Grid item xs={12} className={classes.propertyItem}>
        <Typography className={classes.propertyLabel}>Component ID</Typography>
        <Box className={classes.fieldBox}>
          <Typography className={classes.propertyLabelText}>
            {component.projectComponentId}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} className={classes.propertyItem}>
        <Typography className={classes.propertyLabel}>
          Council district(s)
        </Typography>
        <Box className={classes.fieldBox}>
          <Typography className={classes.propertyLabelText}>
            {component.councilDistrict}
          </Typography>
        </Box>
      </Grid>
      {component.componentLength > 0 && (
        <Grid item xs={12} className={classes.propertyItem}>
          <Typography className={classes.propertyLabel}>Length</Typography>
          <Box className={classes.fieldBox}>
            <Typography className={classes.propertyLabelText}>
              {component.componentLength.toLocaleString()}'
            </Typography>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default ComponentProperties;
