import React, { forwardRef } from "react";
import Box from "@mui/material/Box";
import { useDocumentTitle } from "src/utils/documentTitle";

const Page = forwardRef(({ children, title = "", ...rest }, ref) => {
  useDocumentTitle(title);
  return (
    <Box className="page" ref={ref} {...rest}>
      {children}
    </Box>
  );
});

export default Page;
