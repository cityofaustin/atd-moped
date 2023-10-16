import { useEffect, useState } from "react";

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
  errorMessageDispatch,
}) => {
  const [hasComponentSetFromUrl, setHasComponentSetFromUrl] = useState(false);

  // TODO: Show alert when component is not found

  // Set clicked component from initial params once data loads
  useEffect(() => {
    if (hasComponentSetFromUrl) return;

    // Get component id from url if there is one
    const currentSearchParams = new URLSearchParams(window.location.search);
    const componentParamId = parseInt(
      currentSearchParams.get("project_component_id")
    );

    // Set clicked component when project component data loads
    if (
      !hasComponentSetFromUrl &&
      componentParamId &&
      !clickedComponent &&
      projectComponents.length > 0
    ) {
      const componentFromParams = projectComponents.find(
        (component) => component.project_component_id === componentParamId
      );
      console.log(componentFromParams, componentParamId);

      if (componentFromParams) {
        setClickedComponent(componentFromParams);

        // Bring clicked component into view
        const ref = componentFromParams?._ref;
        ref?.current && ref.current.scrollIntoView({ behavior: "smooth" });

        // Track that initial component has been set from initial params
        setHasComponentSetFromUrl(true);
      } else {
        console.log("not found");
        errorMessageDispatch({
          type: "show_error",
          payload: {
            message: `Component ID #${componentParamId} could not be found. 
            The component may have been moved to another project or deleted. 
            Please check this project's activity log for more details.`,
            severity: "error",
          },
        });
      }
    }
  }, [
    hasComponentSetFromUrl,
    clickedComponent,
    projectComponents,
    setClickedComponent,
    setHasComponentSetFromUrl,
    errorMessageDispatch,
  ]);

  const updateClickedComponentIdInSearchParams = (clickedComponent) => {
    const clickedComponentId = clickedComponent?.project_component_id ?? null;

    updateParamsWithoutRender("project_component_id", clickedComponentId);
  };

  return { updateClickedComponentIdInSearchParams };
};
