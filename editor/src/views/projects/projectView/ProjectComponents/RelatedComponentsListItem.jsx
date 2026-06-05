import ComponentListItem from "./ComponentListItem";
import Link from "@mui/material/Link";
import { ComponentIconByLineRepresentation } from "./utils/form";
import theme from "src/theme/index";

const RelatedComponentsListItem = ({
  component,
  onClickZoomToComponent,
  setIsClickedComponentRelated,
  makeClickedComponentUpdates,
  isExpanded,
  isNotCreatingOrEditing,
}) => {
  const onZoomClick = () => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(true);
  };

  const onRelatedListItemClick = () => {
    if (isExpanded) {
      makeClickedComponentUpdates(null);
      setIsClickedComponentRelated(false);
    } else if (isNotCreatingOrEditing) {
      makeClickedComponentUpdates(component);
      setIsClickedComponentRelated(true);
    }
  };

  const lineRepresentation = component?.moped_components?.line_representation;
  return (
    <ComponentListItem
      key={component.project_component_id}
      component={component}
      isExpanded={isExpanded}
      onZoomClick={onZoomClick}
      onListItemClick={onRelatedListItemClick}
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
};

export default RelatedComponentsListItem;
