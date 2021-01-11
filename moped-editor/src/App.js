import "react-perfect-scrollbar/dist/css/styles.css";
import React, { useEffect, useRef } from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import "src/mixins/chartjs";
import theme from "src/theme";
import { routesArr, restrictRoutes } from "src/routes";
import { useUser, getJwt, getHighestRole } from "./auth/user";

// Apollo GraphQL Client
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const App = () => {
  const restrictedRoutes = restrictRoutes(routesArr);
  console.log(restrictedRoutes);
  const routing = useRoutes(restrictedRoutes);
  const { user } = useUser();

  // Setup initial Apollo instance
  let client = useRef(new ApolloClient());

  // Setup Apollo connection to Hasura with Cognito token and roles
  useEffect(() => {
    const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

    // Make sure user is authenticated and has valid user claims
    if (user) {
      const token = getJwt(user);
      const role = getHighestRole(user);

      let clientData = {
        uri: HASURA_ENDPOINT,
      };

      // In the local environment, Hasura doesn't expect auth headers and errors
      // if they are passed. For staging & prod, we need do need to pass the JWT
      // token and claim for the user roles.
      if (process.env.REACT_APP_HASURA_ENV !== "local") {
        clientData["headers"] = {
          Authorization: `Bearer ${token}`,
          "x-hasura-role": role,
        };
      }

      client.current = new ApolloClient(clientData);
    }
  }, [user, client]);

  return (
    <ApolloProvider client={client.current}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
