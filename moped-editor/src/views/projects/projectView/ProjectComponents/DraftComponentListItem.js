import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircle from "@material-ui/icons/CheckCircle";

const DraftComponentListItem = ({ component, onSave, onCancel }) => {
  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: "#1276D1",
      }}
    >
      <ListItem dense>
        <ListItemText
          primary={component.component_name}
          secondary={component.component_subtype}
        />
      </ListItem>
      <ListItem dense>
        <ListItemText
          primary={
            <Button
              fullWidth
              size="small"
              startIcon={<Cancel />}
              onClick={onCancel}
            >
              Cancel
            </Button>
          }
        />

        <ListItemText
          primary={
            <Button
              fullWidth
              size="small"
              color="primary"
              variant="contained"
              disabled={!component?.features.length > 0}
              startIcon={<CheckCircle />}
              onClick={onSave}
            >
              Save
            </Button>
          }
        />
      </ListItem>
      <Divider />
    </Box>
  );
};

export default DraftComponentListItem;
