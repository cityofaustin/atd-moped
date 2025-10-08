import React, { useState } from "react";
import { Icon, Typography } from "@mui/material";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import {
  MAPBOX_PADDING_PIXELS,
  MAPBOX_CONTROL_BUTTON_WIDTH,
  COLORS,
} from "./mapStyleSettings";

/**
 * Generates the basemap selector using the SpeedDial component
 * @param {function} setBasemapKey - The function we will call with to change the basemap key value
 * @param {string} basemapKey - The name of the current basemap key
 * @return {JSX.Element}
 */
const BasemapSpeedDial = ({ setBasemapKey, basemapKey }) => {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

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
      sx={(theme) => ({
        position: "absolute",
        height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
        right: `${MAPBOX_PADDING_PIXELS}px`,
        // Make some room for the Mapbox attribution
        bottom: `${MAPBOX_PADDING_PIXELS * 3}px`,
        // Mapbox copyright info collapses to a taller info icon at 990px and below
        [theme.breakpoints.down(991)]: {
          bottom: `${MAPBOX_PADDING_PIXELS * 4}px`,
        },
      })}
      ariaLabel="Basemap Select"
      hidden={false}
      icon={
        <Typography>
          <Icon
            sx={{
              fontWeight: "bold",
              fontSize: "1.75rem",
              position: "relative",
              top: 3,
            }}
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
        sx: {
          width: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
          height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
          backgroundSize: "100% 100% !important",
          borderRadius: "4px",
          background: COLORS.mutedGray,
          color: basemapKey !== "streets" ? "black" : "white",
          backgroundImage:
            basemapKey !== "streets"
              ? `url(${process.env.PUBLIC_URL}/static/images/mapStreets.jpg)`
              : `url(${process.env.PUBLIC_URL}/static/images/mapAerial.jpg)`,
          "& .MuiFab-label": {
            height: "100%",
            ...(isSpeedDialOpen && { backgroundColor: "rgba(0,0,0,.25)" }),
          },
        },
      }}
    >
      <SpeedDialAction
        key={"streets"}
        icon={
          <Typography
            sx={{
              fontSize: ".8rem",
              fontWeight: "bold",
              position: "absolute",
              bottom: 0,
            }}
          >
            Streets
          </Typography>
        }
        tooltipTitle={"Streets Base Map"}
        tooltipPlacement={"top"}
        onClick={() => onBasemapSelect("streets")}
        sx={{
          position: "relative",
          bottom: 0,
          width: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
          height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
          backgroundSize: "100% 100% !important",
          borderRadius: "4px",
          background: COLORS.mutedGray,
          color: "black",
          backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/mapStreets.jpg)`,
        }}
      />
      <SpeedDialAction
        key={"aerial"}
        icon={
          <Typography
            sx={{
              fontSize: ".8rem",
              fontWeight: "bold",
              position: "absolute",
              bottom: 0,
            }}
          >
            Aerial
          </Typography>
        }
        tooltipTitle={"Aerial Base Map"}
        tooltipPlacement={"top"}
        sx={{
          width: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
          height: MAPBOX_CONTROL_BUTTON_WIDTH * 2,
          backgroundSize: "100% 100% !important",
          borderRadius: "4px",
          background: COLORS.mutedGray,
          color: "white",
          backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/mapAerial.jpg)`,
        }}
        onClick={() => onBasemapSelect("aerial")}
      />
    </SpeedDial>
  );
};

export default BasemapSpeedDial;
