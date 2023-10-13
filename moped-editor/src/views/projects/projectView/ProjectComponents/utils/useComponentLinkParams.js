import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Example link: https://localhost:3000/moped/projects/225?tab=map&component_id=277

export const useComponentLinkParams = ({
  setClickedComponent,
  projectComponents,
}) => {
  let [searchParams, setSearchParams] = useSearchParams();
  // TODO: if a component is clicked, set params to component_id
  // TODO: Show alert when component is not found
  // TODO: How to handle related components?

  // Set clicked component from params once data loads
  useEffect(() => {
    const componentId = parseInt(searchParams.get("project_component_id"));
    if (componentId === null) return;
    const componentFromParams = projectComponents.find(
      (component) => component.project_component_id === componentId
    );
    if (componentFromParams) {
      setClickedComponent(componentFromParams);

      const ref = componentFromParams?._ref;
      ref?.current && ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams, projectComponents, setClickedComponent]);
};
