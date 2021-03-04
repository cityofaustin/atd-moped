import React, {useState} from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  CardContent,
  Grid,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import FileUploadDialogSingle from "../../../components/FileUpload/FileUploadDialogSingle";

const useStyles = makeStyles(theme => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
}));

const ProjectFiles = props => {
  const classes = useStyles();
  const { projectId } = useParams();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickUploadFile = () => {
    setDialogOpen(true);
  };

  const handleClickCloseUploadFile = () => {
    setDialogOpen(false);
  };

  const handleClickSaveFile = () => {
    setDialogOpen(false);
  }

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
      <FileUploadDialogSingle
          title={"Upload Media"}
          dialogOpen={dialogOpen}
          handleClickCloseUploadFile={handleClickCloseUploadFile}
          handleClickSaveFile={handleClickSaveFile}
          projectId={projectId}
        />
    </CardContent>
  );
};

export default ProjectFiles;
