import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import theme from "src/theme";
import { routes, restrictRoutes } from "src/routes";
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

var pckg = require("../package.json");
console.info(`🛵 ${pckg.name} ${pckg.version}`);

const App = () => {
  const restrictedRoutes = restrictRoutes(routes);
  const routing = useRoutes(restrictedRoutes);
  const { user } = useUser();

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

  const client = new ApolloClient({
    // Join authLink and httpLink to handle auth in each request
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

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
