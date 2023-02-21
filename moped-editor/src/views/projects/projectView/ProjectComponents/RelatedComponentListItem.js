import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import IconButton from "@material-ui/core/IconButton";
import PlaceOutlinedIcon from "@material-ui/icons/PlaceOutlined";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";
import { COLORS } from "./mapStyleSettings";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    paddingLeft: theme.spacing(1),
  },
  listItemText: {
    marginLeft: theme.spacing(1),
  },
}));

// TODO: Create a ListItem that can be shared between
// DraftComponentListItemm, ComponentListItem, RelatedComponentListItem, and the controls
// TODO: Create new SourcesAndLayers component for shared components
// TODO: Create a component for the controls that use the shared ListItem
// but also has spaces for the related projects control and future ones
// TODO: If it is related, show "Part of project #123 (project # is a link)"
// TODO: Parent and sibling components are not editable
// ?: Should we have a button to refresh the data? It could get stale if going
// to another project, editing that component, and then going back to the other tab
// TODO: Another useMemo to create data structure of parent and children components?

export default function RelatedComponentListItem({
  component,
  isExpanded,
  setClickedComponent,
  onClickZoomToComponent,
}) {
  const classes = useStyles();

  const onListItemClick = () => {
    setClickedComponent(component);
  };

  const componentName = component?.moped_components?.component_name;
  const listItemPrimaryText = componentName;

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? COLORS.bluePrimary : COLORS.white,
      }}
    >
      <ListItem
        dense
        button
        onClick={onListItemClick}
        className={classes.listItem}
      >
        <PlaceOutlinedIcon color="primary" />
        <ListItemText
          primary={`${listItemPrimaryText} - ${component.moped_components?.component_subtype}`}
          secondary={
            <>
              Part of project{" "}
              <Link
                href={`/moped/projects/${component.project_id}?tab=map`}
                target="blank"
              >{`#${component.project_id}`}</Link>
            </>
          }
          className={classes.listItemText}
        />
        <ListItemSecondaryAction>
          <IconButton
            color="primary"
            onClick={() => onClickZoomToComponent(component)}
          >
            <ZoomInIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </Box>
  );
}
