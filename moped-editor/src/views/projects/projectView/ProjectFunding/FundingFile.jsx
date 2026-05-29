import React from "react";
import { Box, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";

const FundingFile = ({ file }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <ProjectFileLink
        fileKey={file.file_key}
        fileUrl={file.file_url}
        fileName={file.file_name}
        condensed
        showNetworkPathStyles={false}
      />
      <IconButton onClick={() => console.log("open")}>
        <MoreHorizIcon />
      </IconButton>
    </Box>
  );
};

export default FundingFile;
