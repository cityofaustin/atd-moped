import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/List";
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from "@mui/icons-material/Close";

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
      <DialogTitle className={classes.dialogTitle}>
        <h3>What do you want to edit?</h3>
        <IconButton onClick={onClose} size="large">
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
