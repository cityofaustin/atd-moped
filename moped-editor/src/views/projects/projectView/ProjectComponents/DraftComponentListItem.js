import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
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
