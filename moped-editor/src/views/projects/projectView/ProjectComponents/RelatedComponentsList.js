import ComponentListItem from "./ComponentListItem";
import Link from "@mui/material/Link";
import { ComponentIconByLineRepresentation } from "./utils/form";
import theme from "src/theme/index";

const RelatedComponentsList = ({
  createState,
  editState,
  shouldShowRelatedProjects,
  clickedComponent,
  makeClickedComponentUpdates,
  onClickZoomToComponent,
  allRelatedComponents,
  setIsClickedComponentRelated,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  const isExpanded = (component) =>
    clickedComponent?.project_component_id === component.project_component_id;

  const onListItemClick = (component) => {
    if (isExpanded(component)) {
      makeClickedComponentUpdates(null);
      setIsClickedComponentRelated(false);
    } else if (isNotCreatingOrEditing) {
      makeClickedComponentUpdates(component);
      setIsClickedComponentRelated(true);
    }
  };

  const onZoomClick = (component) => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(true);
  };

  return (
    isNotCreatingOrEditing &&
    shouldShowRelatedProjects &&
    allRelatedComponents.map((component) => {
      const lineRepresentation =
        component?.moped_components?.line_representation;
      return (
        <ComponentListItem
          key={component.project_component_id}
          component={component}
          isExpanded={isExpanded(component)}
          onZoomClick={() => onZoomClick(component)}
          onListItemClick={() => onListItemClick(component)}
          Icon={
            <ComponentIconByLineRepresentation
              lineRepresentation={lineRepresentation}
              color={theme.palette.map.green}
            />
          }
          selectedBorderColor={theme.palette.map.green}
          additionalListItemText={
            <>
              Part of project{" "}
              <Link
                href={`/moped/projects/${component.project_id}?tab=map&project_component_id=${component.project_component_id}`}
                target="blank"
              >{`#${component.project_id}`}</Link>
            </>
          }
        />
      );
    })
  );
};

export default RelatedComponentsList;
