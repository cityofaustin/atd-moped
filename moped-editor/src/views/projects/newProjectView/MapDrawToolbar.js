import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

import { MODES } from "./NewProjectMap";

export const useButtonStyles = makeStyles({
  controlRow: ({ selected }) => ({
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
    "&:hover": {
      background: selected ? "#0071bc" : "#e6e6e6",
    },
    "&:active": {
      background: selected ? "#0071bc" : "inherit",
    },
  }),
  controlDelete: ({ selected }) => ({
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
    "&:hover": {
      background: selected ? "#0071bc" : "#e6e6e6",
    },
    "&:active": {
      background: selected ? "#0071bc" : "inherit",
    },
  }),
});

const DrawToolbarButton = ({
  selected,
  hovered,
  onSwitchMode,
  selectedMode,
  m,
  hoveredId,
  setHoveredId,
}) => {
  const classes = useButtonStyles({ selected, hovered });

  const onHover = evt => {
    setHoveredId(evt && evt.target.id);
  };

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
        id={m.id}
        onMouseOver={onHover}
        alt={m.text}
        src={`${process.env.PUBLIC_URL}/static/${m.icon}`}
      />
      {hoveredId === m.id && (
        <div className={classes.controlTooltip}>{m.text}</div>
      )}
    </div>
  );
};

export const useToolbarStyles = makeStyles({
  controlContainer: {
    position: "absolute",
    width: 34,
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
});

const DrawToolbar = ({ selectedMode, onSwitchMode, onDelete }) => {
  console.log("selected in component is", selectedMode);

  const [isDeleting, setIsDeleting] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const classes = useToolbarStyles({ selected: selectedMode });

  const onDeleteClick = evt => {
    onDelete(evt);
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 500);
  };

  return (
    <div className={classes.controlContainer}>
      {MODES.map(m => {
        return (
          //   <div
          //     className={classes.controlRow}
          //     onClick={onSwitchMode}
          //     onMouseOver={onHover}
          //     onMouseOut={() => onHover(null)}
          //     selected={m.id === selectedMode}
          //     hovered={m.id === hoveredId}
          //     key={m.id}
          //     id={m.id}
          //   >
          //     <img
          //       id={m.id}
          //       onMouseOver={onHover}
          //       alt={m.text}
          //       src={`${process.env.PUBLIC_URL}/static/${m.icon}`}
          //     />
          //     {hoveredId === m.id && (
          //       <div className={classes.controlTooltip}>{m.text}</div>
          //     )}
          //   </div>

          <DrawToolbarButton
            selected={m.id === selectedMode} // This determines if each button is active
            hovered={m.id === hoveredId} // This determines if each button is hovered
            onSwitchMode={onSwitchMode}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            key={m.id}
            m={m}
          />
        );
      })}
      {/* <div
        className={classes.controlDelete}
        selected={isDeleting}
        onClick={onDeleteClick}
        onMouseOver={onHover}
        onMouseOut={() => onHover(null)}
      >
        <img
          id={"delete"}
          alt={"Delete"}
          onMouseOver={onHover}
          onClick={onDelete}
          src={`${process.env.PUBLIC_URL}/static/icon-delete.svg`}
        />
        {hoveredId === "delete" && (
          <div className={classes.controlTooltip}>{"Delete"}</div>
        )}
      </div> */}
    </div>
  );
};

export default DrawToolbar;
