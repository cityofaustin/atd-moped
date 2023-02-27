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
  listItem: {
    paddingLeft: theme.spacing(1),
  },
  listItemText: {
    marginLeft: theme.spacing(1),
  },
}));

export default function RelatedComponentListItem({
  component,
  isExpanded,
  setClickedComponent,
  onClickZoomToComponent,
  setIsClickedComponentRelated,
}) {
  const classes = useStyles();

  const onListItemClick = () => {
    setClickedComponent(component);
    setIsClickedComponentRelated(true);
  };

  const onZoomClick = () => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(true);
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
          <IconButton color="primary" onClick={onZoomClick}>
            <ZoomInIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </Box>
  );
}
