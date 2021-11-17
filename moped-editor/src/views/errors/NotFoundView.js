import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";
import NavigationSearchInput from "../../layouts/DashboardLayout/NavBar/NavigationSearchInput";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 300,
  },
  subheading: {
    marginTop: 50,
    marginBottom: 50,
  }
}));

const NotFoundView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="404">
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
            <img
              alt="Under development"
              className={classes.image}
              src={`${process.env.PUBLIC_URL}/static/images/moped-flat.svg`}
            />
          </Box>
          <Typography align="center" color="textPrimary" variant="h1" className={classes.subheading}>
            Let's get you back on the road. What are you looking for?
          </Typography>
          <NavigationSearchInput input404Class={true}/>
        </Container>
      </Box>
    </Page>
  );
};

export default NotFoundView;
