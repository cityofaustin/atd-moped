import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";
import mapboxDrawStylesOverrides from "src/styles/mapboxDrawStylesOverrides";

// See https://github.com/visgl/react-map-gl/blob/7.0-release/examples/draw-polygon/src/draw-control.ts
export function DrawControl(props) {
  useControl(
    ({ map }) => {
      map.on("draw.create", props.onCreate);
      map.on("draw.update", props.onUpdate);
      map.on("draw.delete", props.onDelete);

      return new MapboxDraw(props);
    },
    ({ map }) => {
      map.off("draw.create", props.onCreate);
      map.off("draw.update", props.onUpdate);
      map.off("draw.delete", props.onDelete);
    },
    {
      position: props.position,
    }
  );

  return null;
}

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
const DrawPointsControl = (props) => {
  return (
    <DrawControl
      {...props}
      controls={{
        point: true,
        trash: true,
      }}
    />
  );
};

const DrawLinesControl = (props) => {
  return (
    <DrawControl
      {...props}
      controls={{
        line_string: true,
        trash: true,
      }}
    />
  );
};

// TODO:
// 1. Save drawn features to feature collection
// 2. Show previously drawn features in the draw interface when clicked
// 3. Create - select bike lane, use draw tool to draw line, click save
// 4. Update - there is no update
// 5. Delete - click trash can, hover and highlight drawn component, and click to delete
const ComponentsDrawControl = ({ drawLines, onCreate, onUpdate, onDelete }) => {
  const shouldDrawLines = drawLines === true;
  const shouldDrawPoints = drawLines === false;

  const sharedProps = {
    position: "top-right",
    displayControlsDefault: false,
    default_mode: "simple_select",
    clickBuffer: 12,
    onCreate,
    onUpdate,
    onDelete,
    styles: mapboxDrawStylesOverrides,
  };

  if (shouldDrawPoints) return <DrawPointsControl {...sharedProps} />;
  if (shouldDrawLines) return <DrawLinesControl {...sharedProps} />;
};

export default ComponentsDrawControl;
