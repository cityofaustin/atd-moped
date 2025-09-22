import React from "react";

import { Box } from "@mui/material";
import parse from "html-react-parser";

const StatusUpdateWithAuthor = ({ statusUpdate, author, dateCreated }) => {
  return (
    <Box>
      <Box>{parse(String(statusUpdate))}</Box>
      <Box
        sx={(theme) => ({
          width: "100%",
          color: theme.palette.text.secondary,
          fontSize: ".7rem",
        })}
      >
        {author} - {dateCreated}
      </Box>
    </Box>
  );
};

export default StatusUpdateWithAuthor;
