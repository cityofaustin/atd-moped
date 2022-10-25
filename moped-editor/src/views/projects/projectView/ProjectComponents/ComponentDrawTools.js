import React from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";

const ComponentDrawTools = () => {
  const drawControlsRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);

  const onCreate = () => {
    console.log("onCreate");
  };

  const onUpdate = () => {
    console.log("onUpdate");
  };

  const onDelete = () => {
    console.log("onDelete");
  };

  const drawLines = true;

  const onModeChange = (e) => {
    // If we are not drawing, set isDrawing to false so we can select layer features as components
    const { mode } = e;

    if (mode === "draw_point" || mode === "draw_line_string") {
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };

  const initializeExistingDrawFeatures = () => {
    console.log("initializeExistingDrawFeatures");
  };

  return (
    <ComponentsDrawControl
      ref={drawControlsRef}
      onCreate={onCreate}
      onDelete={onDelete}
      onUpdate={onUpdate}
      drawLines={drawLines}
      onModeChange={onModeChange}
      initializeExistingDrawFeatures={initializeExistingDrawFeatures}
    />
  );
};

export default ComponentDrawTools;
