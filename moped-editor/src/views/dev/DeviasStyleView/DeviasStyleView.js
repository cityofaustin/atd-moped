import React from "react";
import { Grid, Container, Typography } from "@mui/material";
import Page from "src/components/Page";
import TypographyView from "./TypographyView";
import ColorsView from "./ColorsView";

const DeviasStyleView = () => {
  return (
    <Page
      sx={{
        minHeight: "100%",
        paddingBottom: 3,
        paddingTop: 3,
      }}
      title="Moped Styles"
    >
      <Container maxWidth={"lg"}>
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <Typography variant="h1" component="h2">
              Styles
            </Typography>
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <TypographyView />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <ColorsView />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default DeviasStyleView;
