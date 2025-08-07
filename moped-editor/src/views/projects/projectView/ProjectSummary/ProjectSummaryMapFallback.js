import React from "react";

import { Box, Button, Card } from "@mui/material";

import { Link } from "react-router-dom";

/**
 * Renders a fallback component
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummaryMapFallback = () => {
  return (
    <Box>
      <Card
        sx={{
          minHeight: "12rem",
          textAlign: "center",
          padding: "2rem",
        }}
        color="secondary"
      >
        <img
          alt="Map Unavailable"
          src={`${process.env.PUBLIC_URL}/static/images/map_unavailable.png`}
          style={{
            width: "40%",
            marginBottom: "2%",
          }}
        />
        <Box
          sx={{
            color: (theme) => theme.palette.text.secondary,
            fontFamily: "Roboto",
            fontWeight: 500,
            fontSize: "18px",
          }}
        >
          Define and map the assets and features included in this project.
        </Box>
        <Link to="?tab=map">
          <Button
            sx={{
              margin: "1rem",
            }}
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
