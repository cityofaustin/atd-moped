import React, { useRef, useState } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";

const ComponentDrawTools = ({
  draftComponent,
  setDraftComponent,
  linkMode,
}) => {
  const drawControlsRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";

  const onCreate = () => {
    console.log("onCreate");
  };

  const onUpdate = () => {
    console.log("onUpdate");
  };

  const onDelete = () => {
    console.log("onDelete");
  };

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
    shouldShowDrawControls && (
      <ComponentsDrawControl
        ref={drawControlsRef}
        onCreate={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
        linkMode={linkMode}
        onModeChange={onModeChange}
        initializeExistingDrawFeatures={initializeExistingDrawFeatures}
      />
    )
  );
};

export default ComponentDrawTools;
