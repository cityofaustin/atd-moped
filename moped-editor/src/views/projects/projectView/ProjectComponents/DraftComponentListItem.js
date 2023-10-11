import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { COLORS } from "./mapStyleSettings";
import { useComponentListItemText } from "./utils/componentList";

const DraftComponentListItem = ({
  component,
  onSave,
  onCancel,
  saveButtonText,
  saveButtonDisabled,
}) => {
  const { primary, secondary } = useComponentListItemText(component);

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: COLORS.orange,
      }}
    >
      <ListItem dense>
        <ListItemText primary={primary} secondary={secondary} />
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
