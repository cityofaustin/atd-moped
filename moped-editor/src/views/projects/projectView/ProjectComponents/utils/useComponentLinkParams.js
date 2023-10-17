import { useEffect, useState } from "react";

/** Update search params without the router triggering a re-render
 * @see https://github.com/remix-run/react-router/discussions/9851#discussioncomment-5934435
 * @see https://github.com/kentcdodds/kentcdodds.com/blob/027070cdb2742452f98011c114a03ee325052cc7/app/utils/misc.tsx#L298-L325
 * Comment below is adapted from the linked code to apply to our use case in the project components map
 */
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
  // Normally, we'd update the params via useSearchParams from react-router-dom
  // and updating the search params. However, it also triggers a navigation to the new url,
  // which will trigger the map to re-render which we do not want because all our data
  // is already loaded. So, we manually call `window.history.pushState` to avoid
  // the router from triggering the render.
  window.history.replaceState(null, "", newUrl);
};

/**
 * Hook to handle updating the clicked component in the url search params on load and during UI interactions
 * @param {Function} setClickedComponent - function to set the clicked component from params on load
 * @param {Array} projectComponents - array of project components to find the linked component from
 * @param {Function} errorMessageDispatch - function to dispatch error messages to show in MapAlert
 * @returns {Object} - object with function to update clicked component in search params
 */
export const useComponentLinkParams = ({
  setClickedComponent,
  projectComponents,
  errorMessageDispatch,
}) => {
  const [hasComponentSetFromUrl, setHasComponentSetFromUrl] = useState(false);

  // Set clicked component from initial params once data loads
  useEffect(() => {
    if (hasComponentSetFromUrl) return;

    // Get component id from url if there is one
    const currentSearchParams = new URLSearchParams(window.location.search);
    const componentParamId = parseInt(
      currentSearchParams.get("project_component_id")
    );

    // If there wasn't an initial search parameter, we don't need to set clickedComponent from it
    if (!componentParamId) {
      setHasComponentSetFromUrl(true);
      return;
    }

    // Set clicked component from search parameter once projectComponents data loads
    if (projectComponents.length > 0) {
      const componentFromParams = projectComponents.find(
        (component) => component.project_component_id === componentParamId
      );

      if (componentFromParams) {
        setClickedComponent(componentFromParams);

        // Bring clicked component into view
        const ref = componentFromParams?._ref;
        ref?.current && ref.current.scrollIntoView({ behavior: "smooth" });

        // Track that initial component has been set from initial params
        setHasComponentSetFromUrl(true);
      } else {
        errorMessageDispatch({
          type: "show_error",
          payload: {
            message: `Component ID #${componentParamId} could not be found. 
            The component may have been moved to another project or deleted. 
            Please check this project's activity log for more details.`,
            severity: "error",
            onClose: () => {
              errorMessageDispatch({ type: "hide_error" });
              updateParamsWithoutRender("project_component_id", null);
            },
          },
        });
      }
    }
  }, [
    hasComponentSetFromUrl,
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
