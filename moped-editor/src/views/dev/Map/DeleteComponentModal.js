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
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import { CheckCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 0,
  },
}));

const DeleteComponentModal = ({
  showDialog,
  clickedComponent,
  setClickedComponent,
  setIsDeletingComponent,
  onDeleteComponent,
}) => {
  const classes = useStyles();

  const onClose = () => {
    setIsDeletingComponent(false);
    setClickedComponent(null);
  };

  if (!clickedComponent) return null;
  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Are you sure you want to delete this component?</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <List>
            <Box borderLeft={7} borderColor="secondary.main">
              <ListItem>
                <ListItemText
                  primary={clickedComponent.component_name}
                  secondary={clickedComponent.component_subtype}
                />
              </ListItem>
            </Box>
          </List>
        </Grid>
        <Grid container spacing={1} display="flex" justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CheckCircle />}
              onClick={onDeleteComponent}
              size="small"
            >
              Delete component
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<Cancel />}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteComponentModal;
