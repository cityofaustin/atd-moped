import React from "react";
import { Container, Grid } from "@mui/material";
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
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Profile />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
