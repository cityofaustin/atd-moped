import React from "react";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

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
        <Box p={3} className={props.className}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;
