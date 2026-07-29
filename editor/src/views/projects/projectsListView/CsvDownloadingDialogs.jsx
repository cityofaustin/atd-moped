import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  DialogActions,
} from "@mui/material";

export const CsvDownloadingDialog = ({ downloadingDialogOpen }) => (
  <Dialog open={downloadingDialogOpen} aria-labelledby="form-dialog-title">
    <DialogTitle variant="h4" />
    <DialogContent>
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 2,
            lg: 2,
          }}
        >
          <CircularProgress />
        </Grid>
        <Grid
          size={{
            xs: 10,
            lg: 10,
          }}
        >
          <DialogContentText>
            Preparing download, please wait.
          </DialogContentText>
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
);

export const CsvDownloadOptionsDialog = ({
  dialogOpen,
  handleDialogClose,
  handleContinueButtonClick,
  handleRadioSelect,
  columnDownloadOption,
}) => (
  <Dialog open={dialogOpen} onClose={handleDialogClose}>
    <DialogContent>
      <FormControl>
        <RadioGroup value={columnDownloadOption} onChange={handleRadioSelect}>
          <FormControlLabel
            control={<Radio />}
            label={"Download visible columns"}
            value={"visible"}
          />
          <FormControlLabel
            control={<Radio />}
            label={"Download all columns"}
            value={"all"}
          />
        </RadioGroup>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose}>Cancel</Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleContinueButtonClick}
      >
        Continue
      </Button>
    </DialogActions>
  </Dialog>
);
