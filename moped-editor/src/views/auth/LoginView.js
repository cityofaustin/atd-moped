import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Page from "src/components/Page";
import { useUser } from "src/auth/user";
import useAuthentication from "src/auth/useAuthentication";
import SimpleDialog from "src/components/SimpleDialog";

const LoginView = () => {
  const { login, loginLoading } = useUser();
  const { signInSSO, isLoading } = useAuthentication();

  // a handler for when the user clicks the "login" button
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // wait to see if login was successful (we don't care about the return
      // value here)
      await login(values.email, values.password);

      // mark the form as non-submitting
      setSubmitting(false);
    } catch (err) {
      // If an error occured, showcase the proper message (we customised the
      // message ourselves in `UserProvider`'s code)
      setErrors({ password: err.message });
      setSubmitting(false);
    }
  };

  const dialogContent = {
    link: (
      <Typography display="inline" color="textSecondary" variant="body2">
        <Link href="#">here</Link>.
      </Typography>
    ),
    body: (
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box m={2}>
              <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                label="Email Address"
                margin="normal"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.password && errors.password)}
                fullWidth
                helperText={touched.password && errors.password}
                label="Password"
                margin="normal"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />
              <Box my={2}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign in now
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    ),
  };

  return (
    <Page
      title="Login"
      sx={{
        height: "100%",
        paddingY: 3,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Backdrop
          sx={(theme) => ({
            zIndex: theme.zIndex.drawer + 1,
            color: theme.palette.background.default,
          })}
          open={isLoading || loginLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Container maxWidth="sm">
          <Box mb={"4em"}>
            <Box display="flex" justifyContent="center" mb={2}>
              <img
                alt="Logo"
                src={`${process.env.PUBLIC_URL}/static/moped.svg`}
                width="160px"
                height="160px"
              />
            </Box>
            <Typography color="textPrimary" variant="h1" align="center">
              Moped
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body1"
              align="center"
            >
              Austin's mobility project tracking platform
            </Typography>
          </Box>
          <Box mb={3}>
            <Button
              color="primary"
              fullWidth
              startIcon={<AccountCircleIcon />}
              onClick={signInSSO}
              size="large"
              variant="contained"
              disabled={
                !["staging", "production"].includes(
                  process.env.REACT_APP_HASURA_ENV
                )
              }
            >
              City of Austin Sign-In
            </Button>
          </Box>
          <Box align="center">
            <Typography display="inline" color="textSecondary" variant="body2">
              External user? Sign in{" "}
            </Typography>
            <SimpleDialog content={dialogContent} />
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
