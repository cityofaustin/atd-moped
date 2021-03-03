import React from "react";
import {
  AccordionDetails,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";

import FileUpload from "../../../components/FileUpload/FileUpload";

import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  title: {
    padding: "0rem 0 2rem 0",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    padding: 0,
  },
  list: {
    flexBasis: "66.66%",
    padding: 0,
  },
  uploads: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const ProjectFiles = props => {
  const classes = useStyles();

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <div className={classes.root}>
            <h2 className={classes.title}>File Attachments</h2>

            <AccordionDetails className={classes.details}>
              <div className={classes.list}>This is a list!</div>
              <div className={clsx(classes.uploads, classes.helper)}>
                <FileUpload />
                <Typography variant="caption">
                  To upload, drag and drop your files here or click browse.<br />
                  Compatible with Chrome, Safari, Edge, FireFox and Brave.<br />
                  <a
                      href="#secondary-heading-and-columns"
                      className={classes.link}
                  >
                    Learn more
                  </a>
                </Typography>
              </div>
            </AccordionDetails>
          </div>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectFiles;
