import React from "react";

import { Box, Button, Card, Icon, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  card: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "12rem",
    textAlign: "center",
    padding: "1rem",
  },
  mapIcon: {
    maxWidth: "9rem",
    padding: "1rem",
  },
  paragraphGroup: {
    margin: "1rem 0",
  },
  button: {
    margin: "1rem",
  },
}));

const ProjectSummaryMapFallback = ({
  error,
  componentStack,
  resetErrorBoundary,
}) => {
  const classes = useStyles();

  return (
    <Box>
      <Card className={classes.card} color="secondary">
        <img
          className={classes.mapIcon}
          alt="Logo"
          src={`${process.env.PUBLIC_URL}/static/map-error.svg`}
        />
        <h1>Map Unavailable</h1>
        <div className={classes.paragraphGroup}>
          <p>
            It appears the map data does not exist, or it has become outdated or
            corrupted.
          </p>
          <p>
            Create another map, or feel free to contact support for more
            options.
          </p>
        </div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<Icon>edit</Icon>}
        >
          Clear & Edit Map
        </Button>
      </Card>
    </Box>
  );
};

export default ProjectSummaryMapFallback;
