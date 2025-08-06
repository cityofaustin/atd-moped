import React, { forwardRef } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

const Page = forwardRef(({ children, title = "", ...rest }, ref) => {
  return (
    <Box className="page" ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Page;
