import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Page from "src/components/Page";
import NavigationSearchInput from "src/layouts/DashboardLayout/NavBar/NavigationSearchInput";

const NotFoundView = () => {
  return (
    <Page
      sx={{
        height: "100%",
        paddingY: 3,
      }}
      title="404"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h2">
            404: The page you are looking for doesn't exist.
          </Typography>

          <Box textAlign="center">
            <Box
              component="img"
              alt="Under development"
              src={`${process.env.PUBLIC_URL}/static/images/moped-flat.svg`}
              sx={{
                marginTop: 6,
                display: "inline-block",
                maxWidth: "100%",
                width: 300,
              }}
            />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            variant="h1"
            sx={{
              marginY: 6,
            }}
          >
            Let's get you back on the road. What are you looking for?
          </Typography>
          <NavigationSearchInput input404Class={true} />
        </Container>
      </Box>
    </Page>
  );
};

export default NotFoundView;
