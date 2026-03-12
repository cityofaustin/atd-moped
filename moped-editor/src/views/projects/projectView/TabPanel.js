import React from "react";
import { Box } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`moped-tabpanel-simple-${index}`}
      aria-labelledby={`moped-tabpanel-simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={props.className} sx={{
          p: 3
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
