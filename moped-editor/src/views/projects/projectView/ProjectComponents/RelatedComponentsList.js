import ComponentListItem from "./ComponentListItem";
import Link from "@material-ui/core/Link";
import { ComponentIconByLineRepresentation } from "./utils/form";
import theme from "src/theme/index";

const RelatedComponentsList = ({
  createState,
  editState,
  shouldShowRelatedProjects,
  clickedComponent,
  setClickedComponent,
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
      setClickedComponent(null);
      setIsClickedComponentRelated(false);
    } else if (isNotCreatingOrEditing) {
      setClickedComponent(component);
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
                href={`/moped/projects/${component.project_id}?tab=map`}
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
