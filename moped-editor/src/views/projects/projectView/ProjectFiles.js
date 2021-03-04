import React from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";

import FileUpload from "../../../components/FileUpload/FileUpload";

import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textField: {
    marginTop: "1rem",
  },
  textFieldAdornment: {
    position: "relative",
    top: "-1.6rem",
  },
  textFieldAdornmentColor: {
    color: "grey",
  },
}));

const ProjectFiles = props => {
  const classes = useStyles();
  const { projectId } = useParams();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickUploadFile = () => {
    setDialogOpen(true);
  };

  const handleClickCloseUploadFile = () => {
    setDialogOpen(false);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Grid container>
            <Grid sm={12} md={6}>
              <h2 className={classes.title}>File Attachments</h2>
            </Grid>
            <Grid sm={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                className={classes.uploadFileButton}
                startIcon={<Icon>backup</Icon>}
                onClick={handleClickUploadFile}
              >
                Upload File
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Uploaded by</TableCell>
              <TableCell align="right">Upload Date</TableCell>
              <TableCell align="right">File Size (mb)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={dialogOpen}
        onClose={handleClickCloseUploadFile}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Upload Media"}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid md={12}>
              <TextField
                className={classes.textField}
                id="standard-multiline-flexible"
                placeholder={"File Title"}
                multiline
                rowsMax={4}
                value={null}
                onChange={null}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={classes.textFieldAdornmentColor}
                    >
                      <Icon>info</Icon>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              <TextField
                className={classes.textField}
                id="standard-multiline-static"
                placeholder={"File Description"}
                multiline
                rows={4}
                defaultValue={null}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={`${classes.textFieldAdornment} ${classes.textFieldAdornmentColor}`}
                    >
                      <Icon>textsms</Icon>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid md={12} className={classes.fileUpload}>
              <FileUpload
                limit={1}
                sizeLimit={"1024MB"}
                principal={"project"}
                projectId={projectId}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseUploadFile}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
          <Button
            onClick={handleClickCloseUploadFile}
            color="primary"
            variant="contained"
            startIcon={<Icon>save</Icon>}
            disabled={true}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  );
};

export default ProjectFiles;
