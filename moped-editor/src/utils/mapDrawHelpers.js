import React, { useState, useRef } from "react";
import MapDrawToolbar from "../views/projects/newProjectView/MapDrawToolbar";
import { Editor } from "react-map-gl-draw";
import {
  DrawPointMode,
  EditingMode,
  RENDER_STATE,
  SHAPE,
} from "react-map-gl-draw";
import theme from "../theme/index";
import { mapStyles } from "../utils/mapHelpers";

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
const CIRCLE_RADIUS = 20;

const SELECTED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: mapStyles.statusOpacities.selected,
};

const HOVERED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: mapStyles.statusOpacities.hovered,
};

const DEFAULT_STYLE = {
  stroke: theme.palette.primary.main,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: mapStyles.statusOpacities.unselected,
};

// https://github.com/uber/nebula.gl/tree/master/modules/react-map-gl-draw#styling-related-options
/**
 * Style a feature based on feature type and draw render state
 * @param {object} featureStyle - Contains data about feature render state and type (shape)
 * @param {object} featureStyle.feature - A GeoJSON feature
 * @param {string} featureStyle.state - String describing the render state of a drawn feature (SELECTED or HOVERED)
 * @return {object} React style object applied to a feature
 */
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

export function useMapDrawTools() {
  const mapEditorRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const [selectedEditHandleIndexes, setSelectedEditHandleIndexes] = useState(
    []
  );

  const switchMode = e => {
    const switchModeId = e.target.id === modeId ? null : e.target.id;
    const mode = MODES.find(m => m.id === switchModeId);
    const modeHandler = mode && mode.handler ? new mode.handler() : null;

    setModeId(switchModeId);
    setModeHandler(modeHandler);
    setIsDrawing(true);
  };

  const onSelect = selected => {
    setSelectedFeatureIndex(selected && selected.selectedFeatureIndex);
    setSelectedEditHandleIndexes(
      selected && selected.selectedEditHandleIndexes
    );
  };

  const onDelete = () => {
    if (selectedEditHandleIndexes.length) {
      try {
        mapEditorRef.current.deleteHandles(
          selectedFeatureIndex,
          selectedEditHandleIndexes
        );
      } catch (error) {
        // eslint-disable-next-line no-undef, no-console
        console.error(error.message);
      }
      return;
    }

    if (selectedFeatureIndex === null || selectedFeatureIndex === undefined) {
      return;
    }

    mapEditorRef.current.deleteFeatures(selectedFeatureIndex);

    // Update modeId to momentarily change the background color of the delete icon on click
    const previousMode = modeId;
    setModeId("delete");
    setTimeout(() => setModeId(previousMode), 500);
  };

  const renderDrawToolbar = () => {
    return (
      <MapDrawToolbar
        selectedModeId={modeId}
        onSwitchMode={switchMode}
        onDelete={onDelete}
      />
    );
  };

  const renderMapDrawTools = () => (
    <>
      <Editor
        ref={mapEditorRef}
        featureStyle={getFeatureStyle}
        onSelect={onSelect}
        clickRadius={12}
        mode={modeHandler}
      />
      {renderDrawToolbar()}
    </>
  );

  return { isDrawing, setIsDrawing, renderMapDrawTools };
}
