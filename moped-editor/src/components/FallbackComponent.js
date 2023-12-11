import React from "react";
import { Box, Container, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

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
    width: 200,
  },
  subheading: {
    marginTop: 50,
    marginBottom: 50,
  },
  errorText: {
    color: "#ff6549",

  }
}));

const FallbackComponent= ({ error, resetErrorBoundary, apolloError=false}) => {
    const classes = useStyles();
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    console.log(apolloError)
  
    return (
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h3">
            Whoops. This is embarassing.
          </Typography>
          <Box textAlign="center">
            <img
              alt="Under development"
              className={classes.image}
              src={`${process.env.PUBLIC_URL}/static/images/moped-flat.svg`}
            />
          </Box>
          {apolloError?
          <Typography>try refreshing your browser.</Typography>
          :<Typography align="center" className={classes.errorText}>
            {error.message}
          </Typography>}
        </Container>
      </Box>
    );
  }

  export default FallbackComponent;