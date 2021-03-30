import {
  DrawPointMode,
  EditingMode,
  RENDER_STATE,
  SHAPE,
} from "react-map-gl-draw";
import theme from "../theme/index";

export const MODES = [
  {
    id: "drawPoint",
    text: "Draw Point",
    handler: DrawPointMode,
    icon: "icon-point.svg",
  },
  {
    id: "edit",
    text: "Edit Point",
    handler: EditingMode,
    icon: "icon-select.svg",
  },
  {
    id: "delete",
    text: "Delete",
    icon: "icon-delete.svg",
  },
];

const STROKE_COLOR = theme.palette.primary.main;
const FILL_COLOR = theme.palette.primary.main;
const CIRCLE_RADIUS = 8;

const SELECTED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: 0.3,
};

const HOVERED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: 0.3,
};

const DEFAULT_STYLE = {
  stroke: "#000",
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: 0.1,
};

// https://github.com/uber/nebula.gl/blob/17aa19903bda8e5caaf14b6d25da624a1d317919/examples/react-map-gl-draw/style.js#L100
export function getFeatureStyle({ feature, state }) {
  const type = feature.properties.shape || feature.geometry.type;
  let style = null;

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  switch (type) {
    case SHAPE.POINT:
      style.r = CIRCLE_RADIUS;
      break;

    default:
  }

  return style;
}
