import { useSearchParams } from "react-router-dom";

export const useComponentLinkParams = ({ setClickedComponent }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  // const { path } = useRouteMatch();
  // const { url } = useRouteMatch();

  // TODO: searchParams.get("component_id") returns null if not present
  // TODO: if present, set clickedComponent to component_id
  // TODO: if a component is clicked, set params to component_id
  console.log(searchParams.get("component_id"));

  return {
    searchParams,
    // projectId,
    // componentId,
    // path,
    // url,
  };
};
