import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";

const MilestoneProgressMeter = ({ completedMilestonesPercentage }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={completedMilestonesPercentage}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div">
          {`${Math.round(completedMilestonesPercentage)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default MilestoneProgressMeter;
