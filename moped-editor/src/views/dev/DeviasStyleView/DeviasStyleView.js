import React from "react";
import { Grid2, Container, Typography } from "@mui/material";
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
        <Grid2 container spacing={3}>
          <Grid2
            size={{
              lg: 12,
            }}
          >
            <Typography variant="h1" component="h2">
              Styles
            </Typography>
          </Grid2>
          <Grid2
            size={{
              lg: 8,
              md: 12,
              xl: 9,
              xs: 12,
            }}
          >
            <TypographyView />
          </Grid2>
          <Grid2
            size={{
              lg: 4,
              md: 6,
              xl: 3,
              xs: 12,
            }}
          >
            <ColorsView />
          </Grid2>
        </Grid2>
      </Container>
    </Page>
  );
};

export default DeviasStyleView;
