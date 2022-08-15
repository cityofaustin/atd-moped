import React from "react";
import { Collapse, makeStyles } from "@material-ui/core";

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
}));

/**
 * THe project component map viewer
 * @param {boolean} transitionIn - If true, the collapse will transition in
 * @param {function} onExited - Callback fired after the "exited" status is applied
 * @param {JSX.Element} children - Any components we want to render within the collapse
 * @return {JSX.Element}
 * @constructor
 */
const MapToolsCollapse = ({ children, transitionIn, onExited }) => {
  const classes = useStyles();

  return (
    <Collapse
      className={classes.mapTools}
      in={transitionIn}
      onExited={onExited}
    >
      {children}
    </Collapse>
  );
};

export default MapToolsCollapse;
