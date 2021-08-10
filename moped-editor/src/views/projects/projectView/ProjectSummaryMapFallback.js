import React from "react";

import { Box, Button, Card, Icon, makeStyles } from "@material-ui/core";

import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  card: {
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
  mapErrorTitle: {
    fontSize: "24px",
  },
}));

/**
 * Renders a fallback component that shows the user whenever there is a map error.
 * @param {object} error - provided by ErrorBoundary component, contains error details.
 * @param {function} resetErrorBoundary - A function that forces ErrorBoundary to re-render it's children components
 * @param {object} mapData - The map data with errors to show in the console for debugging
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummaryMapFallback = ({ error, mapData }) => {
  const classes = useStyles();

  /**
   * Log whatever error there may be
   */
  console.error("MapDataError: ", error);
  console.error("MapData: ", mapData);

  return (
    <Box>
      <Card className={classes.card} color="secondary">
        <img
          className={classes.mapIcon}
          alt="Logo"
          src={`${process.env.PUBLIC_URL}/static/map-error.svg`}
        />
        <h3 className={classes.mapErrorTitle}>No map available</h3>
        <div className={classes.paragraphGroup}>
          <p>
            This project does not have components or is outdated. Create new
            components or{" "}
            <a
              href={
                "https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%7D"
              }
            >
              submit a support request
            </a>{" "}
            for more options.
          </p>
        </div>
        <Link to="?tab=map">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<Icon>edit</Icon>}
          >
            MAP PROJECT
          </Button>
        </Link>
      </Card>
    </Box>
  );
};

export default ProjectSummaryMapFallback;
