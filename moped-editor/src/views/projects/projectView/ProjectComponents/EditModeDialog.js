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

const EditModeDialog = ({ showDialog, onClose, setIsEditingComponent }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={showDialog}
      onClose={onClose}
      className={{ paper: classes.dialog }}
    >
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
              onClick={() => alert("Now you can edit this component's attributes")}
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
              onClick={() => alert("Now you can edit this component's features")}
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
