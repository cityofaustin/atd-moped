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
  makeStyles,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Page from "src/components/Page";
import { useUser } from "../../auth/user";
import useAuthentication from "../../auth/useAuthentication";
import SimpleDialog from "../../components/SimpleDialog";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.background.default,
  },
}));

const LoginView = () => {
  const classes = useStyles();

  const { login, loginLoading } = useUser();
  const { signIn, isLoading } = useAuthentication();

  // a handler for when the user clicks the "login" button
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // wait to see if login was successful (we don't care about the return
      // value here)
      await login(values.email, values.password);

      // mark the form as non-subbmitting
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
          password: Yup.string()
            .max(255)
            .required("Password is required"),
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
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Backdrop className={classes.backdrop} open={isLoading || loginLoading}>
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
              onClick={() => signIn()}
              size="large"
              variant="contained"
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
