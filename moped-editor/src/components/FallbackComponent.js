import React from "react";
import { Box, Container, Typography } from "@mui/material";
import ExternalLink from "./ExternalLink";
import { useUser } from "src/auth/user";
import theme from "src/theme";

// includes the error.message as the text in field 400 ("Describe the problem")
// and the email of the user logged in in field 406
const createBugReportLink = (error, userEmail) => {
  return `https://atd.knack.com/dts#new-service-request/?view_249_vars=%7B%22field_398%22%3A%22Bug%20Report%20%E2%80%94%20Something%20is%20not%20working%22%2C%22field_399%22%3A%22Moped%22%2C%22field_400%22%3A%22${error.message}%22%2C%22field_406%22%3A%22${userEmail}%22%7D`;
};

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  const { user } = useUser();
  const userEmail = user?.idToken?.payload?.email;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <Container
        sx={{
          paddingY: 3,
          backgroundColor: theme.palette.background.paper,
          maxWidth: "525px",
          marginTop: 2,
        }}
      >
        <Box textAlign="center">
          <Box
            component="img"
            alt="the moped logo with a flat rear tire"
            src={`${process.env.PUBLIC_URL}/static/images/moped-flat.svg`}
            sx={{
              display: "inline-block",
              maxWidth: "100%",
              width: 200,
            }}
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
          sx={{ marginTop: 2 }}
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
          <Typography
            sx={{
              backgroundColor: theme.palette.background.summaryHover,
              fontSize: ".75rem",
              padding: 1,
              fontFamily: "monospace",
            }}
          >
            {error.message}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FallbackComponent;
