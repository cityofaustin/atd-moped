import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

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
    <Dialog open={showDialog} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        Are you sure you want to delete this component?
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 3 }} dividers={true}>
        <Grid container spacing={1}>
          <List>
            <Box borderLeft={7} borderColor="secondary.main">
              <ListItem>
                <ListItemText
                  primary={clickedComponent.moped_components?.component_name}
                  secondary={
                    clickedComponent.moped_components?.component_subtype
                  }
                />
              </ListItem>
            </Box>
          </List>
        </Grid>
        <Grid container spacing={2} display="flex" justifyContent="flex-end">
          <Grid item>
            <Button
              size="small"
              sx={{ color: "text.primary" }}
              startIcon={<Cancel />}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
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
      </DialogContent>
    </Dialog>
  );
};

export default DeleteComponentModal;
