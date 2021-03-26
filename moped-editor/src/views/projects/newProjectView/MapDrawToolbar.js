import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

import { MODES } from "./NewProjectMap";

export const useStyles = makeStyles(theme => ({
  controlContainer: {
    position: "absolute",
    width: 48,
    right: 10,
    top: 56,
    background: "#fff",
    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%);",
    borderRadius: 4,
    outline: "none",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  controlRow: {
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
  },
  controlImg: {
    width: "inherit",
    height: "inherit",
  },
  controlTooltip: {
    position: "absolute",
    right: 52,
    padding: 4,
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    minWidth: 100,
    maxWidth: 300,
    height: 24,
    fontSize: 12,
    zIndex: 9,
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  controlDelete: {
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
    "&:hover": {
      background: ({ selected }) => (selected ? "#0071bc" : "#e6e6e6"),
    },
    "&:active": {
      background: ({ selected }) => (selected ? "#0071bc" : "inherit"),
    },
  },
}));

const DrawToolbar = ({ selectedMode, onSwitchMode, onDelete }) => {
  const classes = useStyles({ selected: selectedMode });

  const [isDeleting, setIsDeleting] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const onHover = evt => {
    setHoveredId(evt && evt.target.id);
  };

  const onDeleteClick = evt => {
    onDelete(evt);
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 500);
  };

  return (
    <div className={classes.controlContainer}>
      {MODES.map(m => {
        return (
          <div
            className={classes.controlRow}
            onClick={onSwitchMode}
            onMouseOver={onHover}
            onMouseOut={() => onHover(null)}
            selected={m.id === selectedMode}
            hovered={m.id === hoveredId}
            key={m.id}
            id={m.id}
          >
            <img
              className={classes.controlImg}
              id={m.id}
              onMouseOver={onHover}
              src={`./${m.icon}`}
            />
            {hoveredId === m.id && (
              <div className={classes.controlTooltip}>{m.text}</div>
            )}
          </div>
        );
      })}
      <div
        className={classes.controlDelete}
        selected={isDeleting}
        onClick={onDeleteClick}
        onMouseOver={onHover}
        onMouseOut={() => onHover(null)}
      >
        <img
          id={"delete"}
          onMouseOver={onHover}
          onClick={onDelete}
          src={"./icon-delete.svg"}
        />
        {hoveredId === "delete" && (
          <div className={classes.controlTooltip}>{"Delete"}</div>
        )}
      </div>
    </div>
  );
};

export default DrawToolbar;
