import "react-perfect-scrollbar/dist/css/styles.css";
import React, { useState } from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import "src/mixins/chartjs";
import theme from "src/theme";
import { routes, restrictRoutes } from "src/routes";
import { useUser, getJwt, getHighestRole } from "./auth/user";
import { setContext } from "@apollo/client/link/context";

import ApolloLinkErrorHandler from "./components/ApolloLinkErrorHandler";

// Apollo GraphQL Client
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

const App = () => {
  const restrictedRoutes = restrictRoutes(routes);
  const routing = useRoutes(restrictedRoutes);
  const { user } = useUser();

  const [errors, setErrors] = useState(null);

  // https://www.apollographql.com/docs/react/networking/authentication/#header
  const httpLink = createHttpLink({ uri: HASURA_ENDPOINT });

  const authLink = setContext((_, { headers }) => {
    // Get the authentication token and role from user if it exists
    const token = getJwt(user);
    const role = getHighestRole(user);

    // Return the headers and role to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        "x-hasura-role": role ? role : "",
      },
    };
  });

  const loggerLink = new ApolloLink((operation, forward) => {
    console.debug(`GraphQL Request: ${operation.operationName}`);
    operation.setContext({ start: new Date() });
    return forward(operation).map(response => {
      const responseTime = new Date() - operation.getContext().start;
      console.debug(`GraphQL Response took: ${responseTime}`);
      return response;
    });
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, extensions }) => {
          setErrors({ code: extensions.code, message: message });
          return null;
        });

      if (networkError) {
        setErrors({ code: "network-error", message: networkError });
      }
    }
  );

  const client = new ApolloClient({
    // Join authLink and httpLink to handle auth in each request
    link: ApolloLink.from([
      loggerLink,
      errorLink.concat(authLink.concat(httpLink)),
    ]),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ApolloLinkErrorHandler
          errors={errors}
          clearErrors={() => setErrors(null)}
        >
          {routing}
        </ApolloLinkErrorHandler>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
