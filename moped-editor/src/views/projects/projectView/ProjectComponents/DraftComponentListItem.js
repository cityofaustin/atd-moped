import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircle from "@material-ui/icons/CheckCircle";
import { COLORS } from "./mapStyleSettings";

const DraftComponentListItem = ({
  primaryText,
  secondaryText,
  onSave,
  onCancel,
  saveButtonText,
  saveButtonDisabled,
}) => {
  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: COLORS.orange,
      }}
    >
      <ListItem dense>
        <ListItemText primary={primaryText} secondary={secondaryText} />
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
              disabled={saveButtonDisabled}
              startIcon={<CheckCircle />}
              onClick={onSave}
            >
              {saveButtonText}
            </Button>
          }
        />
      </ListItem>
      <Divider />
    </Box>
  );
};

export default DraftComponentListItem;
