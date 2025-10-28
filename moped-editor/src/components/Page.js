import React, { forwardRef } from "react";
import { Helmet } from "react-helmet";
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

export default Page;
