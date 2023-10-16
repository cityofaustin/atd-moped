import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Example link: https://localhost:3000/moped/projects/225?tab=map&project_component_id=277

export const useComponentLinkParams = ({
  setClickedComponent,
  projectComponents,
  clickedComponent,
}) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [hasInitialParamBeenSet, setHasInitialParamBeenSet] = useState(false);
  // TODO: if a component is clicked, set params to component_id
  // TODO: Show alert when component is not found
  // TODO: How to handle related components?

  // Set clicked component from params once data loads
  useEffect(() => {
    const componentParamId = parseInt(searchParams.get("project_component_id"));

    if (
      !hasInitialParamBeenSet &&
      componentParamId &&
      !clickedComponent &&
      projectComponents.length > 0
    ) {
      console.log("initializing from params");
      const componentFromParams = projectComponents.find(
        (component) => component.project_component_id === componentParamId
      );
      if (componentFromParams) {
        setClickedComponent(componentFromParams);

        const ref = componentFromParams?._ref;
        ref?.current && ref.current.scrollIntoView({ behavior: "smooth" });
      }

      setHasInitialParamBeenSet(true);
    }

    if (hasInitialParamBeenSet && !componentParamId && clickedComponent) {
      console.log("adding param after clicking component");
      const clickedComponentId = clickedComponent?.project_component_id;

      setSearchParams((prevSearchParams) => {
        prevSearchParams.set("project_component_id", clickedComponentId);
        return prevSearchParams;
      });
    }

    if (hasInitialParamBeenSet && componentParamId && !clickedComponent) {
      console.log("removing param after clicking away from component");
      setSearchParams((prevSearchParams) => {
        prevSearchParams.delete("project_component_id");
        return prevSearchParams;
      });
    }
  }, [
    searchParams,
    clickedComponent,
    projectComponents,
    setClickedComponent,
    setHasInitialParamBeenSet,
    hasInitialParamBeenSet,
    setSearchParams,
  ]);
};
