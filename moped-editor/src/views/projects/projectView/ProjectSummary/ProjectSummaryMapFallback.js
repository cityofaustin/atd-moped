import React from "react";

import { Box, Button, Card } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: "12rem",
    textAlign: "center",
    padding: "2rem",
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
}));

/**
 * Renders a fallback component
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummaryMapFallback = () => {
  const classes = useStyles();

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
