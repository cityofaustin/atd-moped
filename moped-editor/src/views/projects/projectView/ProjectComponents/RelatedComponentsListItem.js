import ComponentListItem from "./ComponentListItem";
import Link from "@mui/material/Link";
import { ComponentIconByLineRepresentation } from "./utils/form";
import theme from "src/theme/index";

const RelatedComponentsListItem = ({
  component,
  onClickZoomToComponent,
  setIsClickedComponentRelated,
  getIsExpanded,
  onRelatedListItemClick,
  style,
}) => {
  const onZoomClick = (component) => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(true);
  };

  const lineRepresentation = component?.moped_components?.line_representation;
  return (
    <ComponentListItem
      key={component.project_component_id}
      style={style}
      component={component}
      isExpanded={getIsExpanded(component)}
      onZoomClick={() => onZoomClick(component)}
      onListItemClick={() => onRelatedListItemClick(component)}
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
