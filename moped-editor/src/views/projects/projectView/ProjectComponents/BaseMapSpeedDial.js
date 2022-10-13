import React, { useState } from "react";
import clsx from "clsx";
import { Icon, makeStyles, Typography } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
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
    marginRight: "4px",
  },
  mapStyleActionLabel: {
    position: "absolute",
    bottom: 0,
  },
  speedDial: {
    position: "absolute",
    height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
    right: `${MAPBOX_PADDING_PIXELS}px`,
    // Mapbox basemap has copyright info below the speedial while NearMap tiles do not
    bottom: ({ basemapKey }) =>
      basemapKey === "aerial"
        ? `${MAPBOX_PADDING_PIXELS}px`
        : `${MAPBOX_PADDING_PIXELS * 3}px`,
    // Mapbox copyright info collapses to a taller info icon at 990px and below
    [theme.breakpoints.down(991)]: {
      bottom: ({ basemapKey }) =>
        basemapKey === "aerial"
          ? `${MAPBOX_PADDING_PIXELS}px`
          : `${MAPBOX_PADDING_PIXELS * 4}px`,
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
const BaseMapSpeedDial = ({ setBasemapKey, basemapKey }) => {
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
    <SpeedDial
      className={classes.speedDial}
      ariaLabel="Basemap Select"
      hidden={false}
      icon={
        <Typography>
          <Icon
            className={clsx(
              classes.mapStyleToggleLabel,
              classes.mapStyleToggleLabelIcon
            )}
          >
            layers
          </Icon>
          <span className={classes.mapStyleToggleLabel}>Map</span>
        </Typography>
      }
      onClose={() => handleBasemapSpeedDialClose(null)}
      onOpen={handleBasemapSpeedDialOpen}
      open={isSpeedDialOpen}
      direction={"left"}
      FabProps={{
        classes: {
          label: classes.fabLabel,
        },
        className: clsx(
          classes.speedDialAction,
          basemapKey !== "streets"
            ? classes.speedDialStreets
            : classes.speedDialAerial
        ),
      }}
    >
      <SpeedDialAction
        key={"streets"}
        icon={
          <Typography
            className={clsx(
              classes.mapStyleToggleLabel,
              classes.mapStyleActionLabel
            )}
          >
            Streets
          </Typography>
        }
        tooltipTitle={"Streets Base Map"}
        tooltipPlacement={"top"}
        onClick={() => handleBasemapSpeedDialClose("streets")}
        className={clsx(classes.speedDialStreets, classes.speedDialAction)}
      />
      <SpeedDialAction
        key={"aerial"}
        icon={
          <Typography
            className={clsx(
              classes.mapStyleToggleLabel,
              classes.mapStyleActionLabel
            )}
          >
            Aerial
          </Typography>
        }
        tooltipTitle={"Aerial Base Map"}
        tooltipPlacement={"top"}
        className={clsx(classes.speedDialAerial, classes.speedDialAction)}
        onClick={() => handleBasemapSpeedDialClose("aerial")}
      />
    </SpeedDial>
  );
};

export default BaseMapSpeedDial;
