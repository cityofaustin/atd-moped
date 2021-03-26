import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core";

import { MODES } from "./constants";

const ICON_MAP = [
  { id: MODES.EDITING, text: "Edit Feature", icon: "icon-select.svg" },
  { id: MODES.DRAW_POINT, text: "Draw Point", icon: "icon-point.svg" },
  { id: MODES.DRAW_PATH, text: "Draw Polyline", icon: "icon-path.svg" },
  { id: MODES.DRAW_POLYGON, text: "Draw Polygon", icon: "icon-polygon.svg" },
  {
    id: MODES.DRAW_RECTANGLE,
    text: "Draw Rectangle",
    icon: "icon-rectangle.svg",
  },
];

export const useStyles = makeStyles({
  controlContainer: {
    position: "absolute",
    width: 48,
    left: 24,
    top: 24,
    background: "#fff",
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.15)",
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
    position: absolute,
    left: 52,
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
  controlDelete: {},
});

const Row = styled.div`
  color: ${props => (props.selected ? "#ffffff" : "inherit")};
  background: ${props =>
    props.selected ? "#0071bc" : props.hovered ? "#e6e6e6" : "inherit"};
`;

const Delete = styled(Row)`
  &:hover {
    background: ${props => (props.selected ? "#0071bc" : "#e6e6e6")};
  }
  &:active: {
    background: ${props => (props.selected ? "#0071bc" : "inherit")};
  }
`;

const DrawToolbar = selectedMode => {
  const classes = useStyles();

  const [isDeleting, setIsDeleting] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const onHover = evt => {
    setHoveredId(evt && evt.target.id);
  };

  const onDelete = evt => {
    props.onDelete(evt);
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 500);
  };

  return (
    <div className={classes.controlContainer}>
      {ICON_MAP.map(m => {
        return (
          <div
            className={classes.controlRow}
            onClick={props.onSwitchMode}
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
              src={m.icon}
            />
            {hoveredId === m.id && <Tooltip>{m.text}</Tooltip>}
          </div>
        );
      })}
      <Delete
        selected={isDeleting}
        onClick={onDelete}
        onMouseOver={onHover}
        onMouseOut={() => onHover(null)}
      >
        <Img
          id={"delete"}
          onMouseOver={onHover}
          onClick={onDelete}
          src={"icon-delete.svg"}
        />
        {hoveredId === "delete" && <Tooltip>{"Delete"}</Tooltip>}
      </Delete>
    </div>
  );
};

export default DrawToolbar;
