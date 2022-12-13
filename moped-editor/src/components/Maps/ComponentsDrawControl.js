import React from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";
import { activeLineWidth } from "src/styles/createDrawStylesOverrides";

// See https://github.com/visgl/react-map-gl/blob/7.0-release/examples/draw-polygon/src/draw-control.ts
// Ref that is forwarded is defined in useMapDrawTools and we need to drill it down here
// so that we can assign the draw instance draw instance that exposes mapbox-gl-draw methods
// that is returned from useControl as its current value
export const DrawControl = React.forwardRef((props, ref) => {
  ref.current = useControl(
    ({ map }) => {
      map.on("draw.create", props.onCreate);
      map.on("draw.update", props.onUpdate);
      map.on("draw.delete", props.onDelete);
      map.on("draw.modechange", (e) => {
        props.onModeChange(e);
        // This override prevents the introduction of line midpoints and vertices into line string geometries
        props.overrideDirectSelect();
      });
      map.on("draw.selectionchange", props.onSelectionChange);

      return new MapboxDraw(props);
    },
    ({ map }) => {
      map.off("draw.create", props.onCreate);
      map.off("draw.update", props.onUpdate);
      map.off("draw.delete", props.onDelete);
      map.off("draw.modechange", props.onModeChange);
    },
    {
      position: props.position,
    }
  );

  return null;
});

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
};

/*
 * mapbox-gl-draw doesn't support rendering draw tool icons dynamically based on the control configuration
 * So, we need to create separate components per case of shown controls and render those dynamically
 * based on the drawLines boolean
 * @see https://github.com/mapbox/mapbox-gl-draw/issues/286
 */
const DrawPointsControl = React.forwardRef((props, ref) => {
  return (
    <DrawControl
      ref={ref}
      {...props}
      controls={{
        point: true,
        trash: true,
      }}
    />
  );
});

const DrawLinesControl = React.forwardRef((props, ref) => {
  return (
    <DrawControl
      ref={ref}
      {...props}
      controls={{
        line_string: true,
        trash: true,
      }}
    />
  );
});

/**
 * This component defines common DrawControl props and also conditionally renders point or line controls
 * The ref that is forwarded is defined in useMapDrawTools and passes through
 * DrawPointsControl and DrawLinesControl so it can make its way to DrawControl and
 * have its current value assigned
 * @param {function} onCreate - fires after drawing is complete and a feature is created
 * @param {function} onUpdate - fires after a feature is updated (used to update on feature drag)
 * @param {function} onDelete - fires after a feature is selected and deleted with the trash icon
 * @param {string} linkMode - tracks if we are editing "lines" or "points"
 * @param {function} onModeChange - fires when a draw mode button is clicked and mode changes
 * @param {function} onSelectionChange - fires when a feature is selected
 * @param {function} initializeExistingDrawFeatures - passed to load existing drawn features into the draw interface on map load
 * @param {function} overrideDirectSelect - overrides direct_select draw mode when map loads
 * @return {JSX.Element} The whole map draw UI
 */

const ComponentsDrawControl = React.forwardRef(
  (
    {
      onCreate,
      onUpdate,
      onDelete,
      linkMode,
      onModeChange,
      onSelectionChange,
      styleOverrides,
    },
    ref
  ) => {
    const shouldDrawLines = linkMode === "lines";
    const shouldDrawPoints = linkMode === "points";

    /**
     * direct_select allows more complex interactions like breaking line strings into midpoints
     * but we only want users to select and deselect with simple_select mode so we override on load
     * @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#simple_select
     *  @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#direct_select
     */
    const overrideDirectSelect = () => {
      ref.current.modes.DIRECT_SELECT = "simple_select";
    };

    const sharedProps = {
      position: "top-right",
      displayControlsDefault: false, // Disable to allow us to set which controls to show
      default_mode: "simple_select",
      clickBuffer: activeLineWidth,
      onCreate,
      onUpdate,
      onDelete,
      onModeChange,
      onSelectionChange,
      overrideDirectSelect,
      styles: styleOverrides,
    };

    if (shouldDrawPoints)
      return <DrawPointsControl ref={ref} {...sharedProps} />;
    if (shouldDrawLines) return <DrawLinesControl ref={ref} {...sharedProps} />;
  }
);

export default ComponentsDrawControl;
