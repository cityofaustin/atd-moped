import React, { useState } from "react";
import { Icon, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import {
  MAPBOX_PADDING_PIXELS,
  MAPBOX_CONTROL_BUTTON_WIDTH,
  COLORS,
} from "./mapStyleSettings";

const useStyles = makeStyles((theme) => ({
  speedDialAction: {
    width: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
    height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
    backgroundSize: "100% 100%",
    borderRadius: 4,
    background: COLORS.mutedGray,
  },
  speedDialStreets: {
    color: "black",
    backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/mapStreets.jpg)`,
  },
  speedDialAerial: {
    color: "white",
    backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/mapAerial.jpg)`,
  },
  fabLabel: ({ isSpeedDialOpen }) => ({
    ...(isSpeedDialOpen && { backgroundColor: "rgba(0,0,0,.25)" }),
    height: "100%",
  }),
  mapStyleToggleLabel: {
    fontSize: ".8rem",
    fontWeight: "bold",
  },
  mapStyleToggleLabelIcon: {
    position: "relative",
    top: 3,
    fontSize: "1.75rem",
  },
  mapStyleActionLabel: {
    position: "absolute",
    bottom: 0,
  },
  speedDial: {
    position: "absolute",
    height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
    right: `${MAPBOX_PADDING_PIXELS}px`,
    // Make some room for the Mapbox attribution
    bottom: `${MAPBOX_PADDING_PIXELS * 3}px`,
    // Mapbox copyright info collapses to a taller info icon at 990px and below
    [theme.breakpoints.down(991)]: {
      bottom: `${MAPBOX_PADDING_PIXELS * 4}px`,
    },
  },
}));

/**
 * Generates the basemap selector using the SpeedDial component
 * @param {function} setBasemapKey - The function we will call with to change the basemap key value
 * @param {string} basemapKey - The name of the current basemap key
 * @return {JSX.Element}
 */
const BasemapSpeedDial = ({ setBasemapKey, basemapKey }) => {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const classes = useStyles({ isSpeedDialOpen });

  /**
   * Changes the current basemap and closes the speed dial menu
   * @param basemapKey - layer key used to expose config in the basemaps object
   */
  const onBasemapSelect = (basemapKey) => {
    setIsSpeedDialOpen(false);
    setBasemapKey(basemapKey);
  };

  const onOpen = () => {
    setIsSpeedDialOpen(true);
  };

  const onClose = () => setIsSpeedDialOpen(false);

  return (
    <SpeedDial
      className={classes.speedDial}
      ariaLabel="Basemap Select"
      hidden={false}
      icon={
        <Typography>
          <Icon
            className={`${classes.mapStyleToggleLabel} ${classes.mapStyleToggleLabelIcon}`}
          >
            layers
          </Icon>
        </Typography>
      }
      onClose={onClose}
      onOpen={onOpen}
      open={isSpeedDialOpen}
      direction={"left"}
      FabProps={{
        classes: {
          label: classes.fabLabel,
        },
        className: `${classes.speedDialAction} ${
          basemapKey !== "streets"
            ? classes.speedDialStreets
            : classes.speedDialAerial
        }`,
      }}
    >
      <SpeedDialAction
        key={"streets"}
        icon={
          <Typography
            className={`${classes.mapStyleToggleLabel} ${classes.mapStyleActionLabel}`}
          >
            Streets
          </Typography>
        }
        tooltipTitle={"Streets Base Map"}
        tooltipPlacement={"top"}
        onClick={() => onBasemapSelect("streets")}
        className={`${classes.speedDialStreets} ${classes.speedDialAction}`}
      />
      <SpeedDialAction
        key={"aerial"}
        icon={
          <Typography
            className={`${classes.mapStyleToggleLabel} ${classes.mapStyleActionLabel}`}
          >
            Aerial
          </Typography>
        }
        tooltipTitle={"Aerial Base Map"}
        tooltipPlacement={"top"}
        className={`${classes.speedDialAerial} ${classes.speedDialAction}`}
        onClick={() => onBasemapSelect("aerial")}
      />
    </SpeedDial>
  );
};

export default BasemapSpeedDial;
