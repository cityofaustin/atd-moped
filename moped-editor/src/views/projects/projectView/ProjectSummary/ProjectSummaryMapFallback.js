import React from "react";

import { Box, Button, Card, makeStyles } from "@material-ui/core";

import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  card: {
    minHeight: "12rem",
    textAlign: "center",
    padding: "2rem",
  },
  mapIcon: {
    maxWidth: "9rem",
    padding: "1rem",
  },
  paragraphGroup: {
    margin: "1rem 0",
  },
  mapPlaceholder: {
    color: theme.palette.text.secondary,
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "18px",
  },
  mapPlaceholderImg: {
    width: "40%",
    marginBottom: "2%",
  },
  button: {
    margin: "1rem",
  },
  mapErrorTitle: {
    fontSize: "24px",
  },
}));

/**
 * Renders a fallback component that shows the user whenever there is a map error.
 * @param {object} error - provided by ErrorBoundary component, contains error details.
 * @param {object} mapData - The map data with errors to show in the console for debugging
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummaryMapFallback = ({ error, mapData }) => {
  const classes = useStyles();

  /**
   * Log whatever error there may be
   */
  console.debug("MapDataError: ", error);
  console.debug("MapData: ", mapData);

  return (
    <Box>
      <Card className={classes.card} color="secondary">
        <img 
          className={classes.mapPlaceholderImg}
          alt="Map Unavailable"
          src={`${process.env.PUBLIC_URL}/static/images/map_unavailable.png`}
        />
        <div className={classes.mapPlaceholder}>
          Define and map the assets and features included in this project.
        </div>
        <Link to="?tab=map">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Add Components
          </Button>
        </Link>
      </Card>
    </Box>
  );
};

export default ProjectSummaryMapFallback;
