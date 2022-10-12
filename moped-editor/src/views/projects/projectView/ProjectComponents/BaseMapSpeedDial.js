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
    bottom: "2rem",
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
  mapStyleToggle: ({ isSpeedDialOpen }) => ({
    ...(isSpeedDialOpen && { backgroundColor: "rgba(0,0,0,.25)" }),
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
  }),
  speedDial: ({ basemapKey }) => ({
    right: "10px !important",
    bottom: basemapKey === "streets" ? "2px !important" : "10px !important",
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
  }),
}));

/**
 * Generates the basemap selector using the SpeedDial component
 * @param {function} handleBasemapChange - The function we will call with to change the basemap
 * @param {string} mapStyle - The name of the current basemap
 * @return {React.ReactPortal|null}
 * @constructor
 */
const BaseMapSpeedDial = ({ setBasemapKey, basemapKey }) => {
  // TODO: Make speedial 44 px from bottom when at 990px or below

  /**
   * Basemap Speed Dial State
   */
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const classes = useStyles({ basemapKey, isSpeedDialOpen });

  /**
   * Changes the current basemap and closes the speed dial menu
   * @param basemapName
   */
  const handleBasemapSpeedDialClose = (basemapName) => {
    setIsSpeedDialOpen(false);
    if (basemapName !== null) setBasemapKey(basemapName);
  };

  /**
   * Opens the speed dial menu
   */
  const handleBasemapSpeedDialOpen = () => {
    setIsSpeedDialOpen(true);
  };

  return (
    <div className={classes.speedDial}>
      <SpeedDial
        ariaLabel="Basemap Select"
        hidden={false}
        icon={
          <Typography className={classes.mapStyleToggle}>
            <Icon className={classes.mapStyleToggleLabelIcon}>layers</Icon>
            <span className={classes.mapStyleToggleLabel}>Map</span>
          </Typography>
        }
        onClose={() => handleBasemapSpeedDialClose(null)}
        onOpen={handleBasemapSpeedDialOpen}
        open={isSpeedDialOpen}
        direction={"left"}
        FabProps={{
          className:
            basemapKey !== "streets"
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

export default BaseMapSpeedDial;
