import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Example link: https://localhost:3000/moped/projects/225?tab=map&project_component_id=277

/** @see https://github.com/kentcdodds/kentcdodds.com/blob/027070cdb2742452f98011c114a03ee325052cc7/app/utils/misc.tsx#L298-L325 */
const updateParamsWithoutRender = (queryKey, queryValue) => {
  const currentSearchParams = new URLSearchParams(window.location.search);
  const oldQuery = currentSearchParams.get(queryKey) ?? "";
  if (queryValue === oldQuery) return;

  if (queryValue) {
    currentSearchParams.set(queryKey, queryValue);
  } else {
    currentSearchParams.delete(queryKey);
  }
  const newUrl = [window.location.pathname, currentSearchParams.toString()]
    .filter(Boolean)
    .join("?");
  // alright, let's talk about this...
  // Normally with remix, you'd update the params via useSearchParams from react-router-dom
  // and updating the search params will trigger the search to update for you.
  // However, it also triggers a navigation to the new url, which will trigger
  // the loader to run which we do not want because all our data is already
  // on the client and we're just doing client-side filtering of data we
  // already have. So we manually call `window.history.pushState` to avoid
  // the router from triggering the loader.
  window.history.replaceState(null, "", newUrl);
};

export const useComponentLinkParams = ({
  setClickedComponent,
  projectComponents,
  clickedComponent,
}) => {
  let [searchParams] = useSearchParams();

  // TODO: Show alert when component is not found
  // TODO: How to handle related components?

  // Set clicked component from params once data loads
  useEffect(() => {
    const componentParamId = parseInt(searchParams.get("project_component_id"));

    if (componentParamId && !clickedComponent && projectComponents.length > 0) {
      console.log("initializing from params");
      const componentFromParams = projectComponents.find(
        (component) => component.project_component_id === componentParamId
      );
      if (componentFromParams) {
        setClickedComponent(componentFromParams);

        const ref = componentFromParams?._ref;
        ref?.current && ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }

    if (!componentParamId && clickedComponent) {
      console.log("adding param after clicking component");
      const clickedComponentId = clickedComponent?.project_component_id;

      updateParamsWithoutRender("project_component_id", clickedComponentId);
    }

    // if (hasInitialParamBeenSet && componentParamId && !clickedComponent) {
    //   console.log("removing param after clicking away from component");
    //   setSearchParams((prevSearchParams) => {
    //     prevSearchParams.delete("project_component_id");
    //     return prevSearchParams;
    //   });
    // }
  }, [searchParams, clickedComponent, projectComponents, setClickedComponent]);
};
