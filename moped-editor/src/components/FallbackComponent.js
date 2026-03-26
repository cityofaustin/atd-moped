import React from "react";
import { Box, Container, Typography } from "@mui/material";
import ExternalLink, { createBugReportLink } from "src/components/ExternalLink";
import { useUser } from "src/auth/user";

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  const { user } = useUser();
  const userEmail = user?.idToken?.payload?.email;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <Container
        // Disable container's responsive maxWidth to override maxWidth in sx
        maxWidth={false}
        sx={(theme) => ({
          paddingY: 3,
          backgroundColor: theme.palette.background.paper,
          maxWidth: "525px",
          marginTop: 2,
        })}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
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
            sx={(theme) => ({
              backgroundColor: theme.palette.background.summaryHover,
              fontSize: ".75rem",
              padding: 1,
              fontFamily: "monospace",
            })}
          >
            {error.message}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FallbackComponent;
