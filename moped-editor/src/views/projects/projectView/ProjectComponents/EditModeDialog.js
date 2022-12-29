import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Button,
} from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import ListIcon from "@material-ui/icons/List";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogContent: {
    paddingBottom: theme.spacing(3),
  },
}));

const EditModeDialog = ({ showDialog, editDispatch, onEditFeatures }) => {
  const classes = useStyles();

  const onClose = () => editDispatch({ type: "cancel_mode_edit" });
  const onEditAttributes = () =>
    editDispatch({ type: "start_attributes_edit" });

  return (
    <Dialog open={showDialog} onClose={onClose}>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>What do you want to edit?</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={1}>
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              className={classes.margin}
              startIcon={<ListIcon />}
              onClick={onEditAttributes}
            >
              Attributes
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              className={classes.margin}
              startIcon={<TimelineIcon />}
              onClick={onEditFeatures}
            >
              Map
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditModeDialog;
