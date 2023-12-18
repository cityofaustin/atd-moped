import React from "react";
import { Box, Container, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    maxWidth: "525px",
  },
  image: {
    display: "inline-block",
    maxWidth: "100%",
    width: 200,
  },
  subheading: {
    marginTop: "1rem",
  },
  errorText: {
    backgroundColor: theme.palette.background.summaryHover,
    fontSize: ".75rem",
    padding: "8px"
  },
}));

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <Container className={classes.root}>
        <Box textAlign="center">
          <img
            alt="the moped logo with a flat rear tire"
            className={classes.image}
            src={`${process.env.PUBLIC_URL}/static/images/moped-flat.svg`}
          />
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          variant="h4"
          gutterBottom
        >
          Something went wrong.
        </Typography>
        <Typography color="textPrimary" variant="body2" gutterBottom className={classes.subheading}>
          You can try refreshing the page or click here to submit a bug report
          with the full error response of the problem you encountered.
        </Typography>
        <Box>
          <Typography variant="overline">error</Typography>
          <Typography className={classes.errorText}>{error.message}</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FallbackComponent;
