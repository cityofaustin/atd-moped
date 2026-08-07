import React, { forwardRef } from "react";
import { Helmet } from "react-helmet";
import Box from "@mui/material/Box";
import { BoxProps } from "@mui/material";

interface PageProps extends BoxProps {
  children: React.ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...rest }, ref) => {
    return (
      <Box className="page" ref={ref} {...rest}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {children}
      </Box>
    );
  }
);

export default Page;
