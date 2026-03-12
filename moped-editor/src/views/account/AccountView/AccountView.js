import React from "react";
import { Container, Grid2 } from "@mui/material";
import Page from "src/components/Page";
import Profile from "./Profile";

const Account = () => {
  return (
    <Page
      sx={{
        minHeight: "100%",
        paddingY: 3,
      }}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={3}>
          <Grid2
            size={{
              lg: 4,
              md: 6,
              xs: 12
            }}>
            <Profile />
          </Grid2>
        </Grid2>
      </Container>
    </Page>
  );
};

export default Account;
