import "react-perfect-scrollbar/dist/css/styles.css";
import React, { useEffect, useRef } from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import "src/mixins/chartjs";
import theme from "src/theme";
import routes from "src/routes";
import { useUser, getJwt, getHighestRole } from "./auth/user";
import { setContext } from "@apollo/client/link/context";

// Apollo GraphQL Client
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

const App = () => {
  const routing = useRoutes(routes);
  const { user } = useUser();

  const httpLink = createHttpLink({ uri: HASURA_ENDPOINT });

  const authLink = setContext((_, { headers }) => {
    // Get the authentication token and role from user if it exists
    const token = getJwt(user);
    const role = getHighestRole(user);

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        "x-hasura-role": role ? role : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  // // Setup initial Apollo instance
  // let client = useRef(
  //   new ApolloClient({ uri: HASURA_ENDPOINT, cache: new InMemoryCache() })
  // );

  // // Setup Apollo connection to Hasura with Cognito token and roles
  // useEffect(() => {
  //   // Make sure user is authenticated and has valid user claims
  //   if (user) {
  //     const token = getJwt(user);
  //     const role = getHighestRole(user);

  //     let clientData = {
  //       uri: HASURA_ENDPOINT,
  //     };

  //     // In the local environment, Hasura doesn't expect auth headers and errors
  //     // if they are passed. For staging & prod, we need do need to pass the JWT
  //     // token and claim for the user roles.
  //     if (process.env.REACT_APP_HASURA_ENV !== "local") {
  //       clientData["headers"] = {
  //         Authorization: `Bearer ${token}`,
  //         "x-hasura-role": role,
  //       };
  //     }

  //     client.current = new ApolloClient(clientData);
  //   }
  // }, [user, client]);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
