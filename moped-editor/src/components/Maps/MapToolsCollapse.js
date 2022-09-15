import React from "react";
import { Button, Collapse, makeStyles } from "@material-ui/core";
import { KeyboardArrowDown } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  mapTools: {
    position: "absolute",
    top: "66px",
    left: "10px",
    zIndex: "1",
    width: "21rem",
    background: theme.palette.common.white,
    border: "lightgray 1px solid",
    borderRadius: "4px",
    padding: ".5rem",
    boxShadow: "0 0 10px 2px rgb(0 0 0 / 10%)",
  },
  mapToolsShowHidden: {
    position: "absolute",
    top: "66px",
    left: "10px",
    zIndex: "1",
    width: "21rem",
    background: theme.palette.common.white,
    border: "lightgray 1px solid",
    borderRadius: "4px",
    boxShadow: "0 0 10px 2px rgb(0 0 0 / 10%)",
    padding: ".5rem",
    "&:hover": {
      background: theme.palette.common.white,
    },
  },
}));

/**
 * THe project component map viewer
 * @param {boolean} transitionInEditsTools - If true, the edit tools will transition in
 * @param {function} onExitedEditTools - Callback fired after after the "exited" status is applied to the edit tools
 * @param {booelan} transitionInShowTools - If true, the show tools will transition in
 * @param {function} onShowToolsClick - Callback fired after show tools button is clicked
 * @param {function} onExitShowTools - Callback fired after before the "exiting" status is appliedt to the show button
 * @param {JSX.Element} children - Any components we want to render within the collapse
 * @return {JSX.Element}
 */
const MapToolsCollapse = ({
  children,
  transitionInEditTools,
  onExitedEditTools,
  transitionInShowTools,
  onShowToolsClick,
  onExitShowTools,
  showButtonText,
}) => {
  const classes = useStyles();

  return (
    <>
      <Collapse in={transitionInShowTools} onExit={onExitShowTools}>
        <Button
          className={classes.mapToolsShowHidden}
          size={"small"}
          onClick={onShowToolsClick}
          startIcon={<KeyboardArrowDown />}
        >
          {showButtonText}
        </Button>
      </Collapse>
      <Collapse
        className={classes.mapTools}
        in={transitionInEditTools}
        onExited={onExitedEditTools}
      >
        {children}
      </Collapse>
    </>
  );
};

export default MapToolsCollapse;
