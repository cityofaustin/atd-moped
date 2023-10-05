import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";

export const CsvDownloadDialog = ({ dialogOpen, handleDialogClose }) => {
  <Dialog
    open={dialogOpen}
    onClose={handleDialogClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title"> </DialogTitle>
    <DialogContent>
      <Grid container spacing={3}>
        <Grid item xs={2} lg={2}>
          <CircularProgress />
        </Grid>
        <Grid item xs={10} lg={10}>
          <DialogContentText>
            Preparing download, please wait.
          </DialogContentText>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose} color="primary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>;
};

const useCsvExport = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return { dialogOpen };
};
