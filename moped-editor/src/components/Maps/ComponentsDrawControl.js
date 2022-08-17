import React from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";
import mapboxDrawStylesOverrides from "src/styles/mapboxDrawStylesOverrides";

// See https://github.com/visgl/react-map-gl/blob/7.0-release/examples/draw-polygon/src/draw-control.ts
// Ref that is forwarded is defined in useMapDrawTools
// useControl returns the draw instance that exposes drawn features
export const DrawControl = React.forwardRef((props, ref) => {
  ref.current = useControl(
    ({ map }) => {
      map.on("draw.create", props.onCreate);
      map.on("draw.update", props.onUpdate);
      map.on("draw.delete", props.onDelete);
      map.on("draw.modechange", props.onModeChange);
      map.on("load", props.initializeExistingDrawFeatures);

      return new MapboxDraw(props);
    },
    ({ map }) => {
      map.off("draw.create", props.onCreate);
      map.off("draw.update", props.onUpdate);
      map.off("draw.delete", props.onDelete);
      map.off("draw.modechange", props.onModeChange);
      map.off("load", props.initializeExistingDrawFeatures);
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

// TODO:
// 1. Save drawn features to feature collection
// 2. Show previously drawn features in the draw interface when component is clicked in the add components map tools
// 5. Delete - click trash can, hover and highlight drawn component, and click to delete
// 6. Active control background is blue
// 7. Hover point get wider blue ring before click to delete
// 8. Disable draw button
/* Ref that is forwarded is defined in useMapDrawTools and pass through
 * DrawPointsControl and DrawLinesControl so it can make its way to DrawControl and
 * have its current value assigned
 */
const ComponentsDrawControl = React.forwardRef(
  (
    {
      drawLines,
      onCreate,
      onUpdate,
      onDelete,
      onModeChange,
      initializeExistingDrawFeatures,
      circleRadius,
    },
    ref
  ) => {
    const shouldDrawLines = drawLines === true;
    const shouldDrawPoints = drawLines === false;

    const sharedProps = {
      position: "top-right",
      displayControlsDefault: false, // Disable to allow us to set which controls to show
      default_mode: "simple_select",
      clickBuffer: 12,
      onCreate,
      onUpdate,
      onDelete,
      onModeChange,
      initializeExistingDrawFeatures,
      styles: mapboxDrawStylesOverrides,
    };

    if (shouldDrawPoints)
      return <DrawPointsControl ref={ref} {...sharedProps} />;
    if (shouldDrawLines) return <DrawLinesControl ref={ref} {...sharedProps} />;
  }
);

export default ComponentsDrawControl;
