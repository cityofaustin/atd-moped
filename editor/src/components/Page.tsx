import React, { forwardRef } from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import { useDocumentTitle } from "src/utils/documentTitle";

interface PageProps extends BoxProps {
  children: React.ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...rest }, ref) => {
    useDocumentTitle(title);

    return (
      <Box className="page" ref={ref} {...rest}>
        <title>{title}</title>

        {children}
      </Box>
    );
  }
);

export default Page;
