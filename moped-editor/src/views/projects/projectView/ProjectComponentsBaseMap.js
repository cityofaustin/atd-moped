import React, { useState } from "react";
import { Icon, makeStyles, Typography } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

export const useStyles = makeStyles((theme) => ({
  speedDialStreets: {
    color: "black",
    backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/mapStreets.jpg) !important`,
  },
  speedDialAerial: {
    color: "white",
    backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/mapAerial.jpg) !important`,
  },
  mapStyleToggle: {
    position: "absolute",
    top: "-10.45rem",
    right: "-2.5rem;",
  },
  mapStyleToggleImage: {
    width: "5rem",
    borderRadius: ".5rem",
  },
  mapStyleToggleLabel: {
    position: "relative",
    bottom: "-1.3rem",
    fontSize: ".8rem",
    fontWeight: "bold",
  },
  mapStyleToggleLabelIcon: {
    position: "relative",
    bottom: "-1.5rem",
    fontSize: ".8rem",
    fontWeight: "bold",
    marginRight: "4px",
  },
  mapStyleToggleTypography: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
  },
  mapStyleToggleTypographyOpen: {
    backgroundColor: "rgba(0,0,0,.25)",
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
  },
  speedDialWithLayerCopyrightText: {
    right: "49px !important",
    bottom: "22px !important",
    position: "absolute",
    zIndex: 1,
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  speedDial: {
    right: "49px !important",
    bottom: "2px !important",
    position: "absolute",
    zIndex: 1,
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

/**
 * Generates the basemap selector using the SpeedDial component
 * @param {function} handleBasemapChange - The function we will call with to change the basemap
 * @param {string} mapStyle - The name of the current basemap
 * @return {React.ReactPortal|null}
 * @constructor
 */
const ProjectComponentsBaseMap = ({ handleBasemapChange, mapStyle }) => {
  const classes = useStyles();

  /**
   * Basemap Speed Dial State
   */
  const [mapBasemapSpeedDialOpen, setBasemapSpeedDialOpen] = useState(false);

  /**
   * Changes the current basemap and closes the speed dial menu
   * @param basemapName
   */
  const handleBasemapSpeedDialClose = (basemapName) => {
    setBasemapSpeedDialOpen(false);
    if (basemapName) handleBasemapChange(basemapName);
  };

  /**
   * Opens the speed dial menu
   */
  const handleBasemapSpeedDialOpen = () => {
    setBasemapSpeedDialOpen(true);
  };

  return (
    <div
      className={
        mapStyle === "streets"
          ? classes.speedDialWithLayerCopyrightText
          : classes.speedDial
      }
    >
      <SpeedDial
        ariaLabel="Basemap Select"
        hidden={false}
        icon={
          <Typography
            className={
              mapBasemapSpeedDialOpen
                ? classes.mapStyleToggleTypographyOpen
                : classes.mapStyleToggleTypography
            }
          >
            <Icon className={classes.mapStyleToggleLabelIcon}>layers</Icon>
            <span className={classes.mapStyleToggleLabel}>Map</span>
          </Typography>
        }
        onClose={() => handleBasemapSpeedDialClose(null)}
        onOpen={handleBasemapSpeedDialOpen}
        open={mapBasemapSpeedDialOpen}
        direction={"left"}
        FabProps={{
          className:
            mapStyle !== "streets"
              ? classes.speedDialStreets
              : classes.speedDialAerial,
        }}
      >
        <SpeedDialAction
          key={"streets"}
          icon={
            <Typography>
              <span className={classes.mapStyleToggleLabel}>Streets</span>
            </Typography>
          }
          tooltipTitle={"Streets Base Map"}
          tooltipPlacement={"top"}
          onClick={() => handleBasemapSpeedDialClose("streets")}
          className={classes.speedDialStreets}
        />
        <SpeedDialAction
          key={"aerial"}
          icon={
            <Typography>
              <span className={classes.mapStyleToggleLabel}>Aerial</span>
            </Typography>
          }
          tooltipTitle={"Aerial Base Map"}
          tooltipPlacement={"top"}
          className={classes.speedDialAerial}
          onClick={() => handleBasemapSpeedDialClose("aerial")}
        />
      </SpeedDial>
    </div>
  );
};

export default ProjectComponentsBaseMap;
