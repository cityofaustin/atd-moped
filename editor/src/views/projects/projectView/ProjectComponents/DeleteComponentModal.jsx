import {
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import FormDialog from "src/components/FormDialog";
import Cancel from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteComponentModal = ({
  showDialog,
  clickedComponent,
  setIsDeletingComponent,
  onDeleteComponent,
}) => {
  const onClose = () => {
    setIsDeletingComponent(false);
  };

  if (!clickedComponent) return null;
  return (
    <FormDialog
      title="Are you sure you want to delete this component?"
      open={showDialog}
      handleClose={onClose}
    >
      <Grid container spacing={1}>
        <List>
          <Box
            sx={{
              borderLeft: 7,
              borderColor: "secondary.main",
            }}
          >
            <ListItem>
              <ListItemText
                primary={clickedComponent.moped_components?.component_name}
                secondary={clickedComponent.moped_components?.component_subtype}
              />
            </ListItem>
          </Box>
        </List>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Grid>
          <Button
            size="small"
            sx={{ color: "text.primary" }}
            startIcon={<Cancel />}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={onDeleteComponent}
            size="small"
          >
            Delete component
          </Button>
        </Grid>
      </Grid>
    </FormDialog>
  );
};
export default DeleteComponentModal;
