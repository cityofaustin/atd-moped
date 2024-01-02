import React from "react";
import { Box, Container, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExternalLink from "./ExternalLink";
import { useUser } from "src/auth/user";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    maxWidth: "525px",
    marginTop: theme.spacing(2)
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
    padding: "8px",
    fontFamily: "monospace",
  },
}));

// includes the error.message as the text in field 400 ("Describe the problem")
// and the email of the user logged in in field 406
const createBugReportLink = (error, userEmail) => {
  return `https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%2C%22field_400%22%3A%22${error.message}%22%2C%22field_406%22%3A%22${userEmail}%22%7D`;
}

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  const classes = useStyles();
  const { user } = useUser();
  const userEmail = user?.idToken?.payload?.email

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
        <Typography
          color="textPrimary"
          variant="body2"
          gutterBottom
          className={classes.subheading}
        >
          You can try refreshing the page or{" "}
          {
            <ExternalLink
              url={createBugReportLink(error, userEmail)}
              text={"click here"}
            />
          }{" "}
          to submit a bug report with the error message of the problem you
          encountered.
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
