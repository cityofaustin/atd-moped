import "react-perfect-scrollbar/dist/css/styles.css";
import React, { useEffect, useRef, useState } from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import "src/mixins/chartjs";
import theme from "src/theme";
import routes from "src/routes";
import { useUser } from "./auth/user";

// Apollo GraphQL Client
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const App = () => {
  const routing = useRoutes(routes);
  const { user } = useUser();
  console.log("user", user);

  // Setup initial Apollo instance
  let client = useRef(new ApolloClient());

  // Keep track of if Apollo is connected to Hasura
  const [isApolloLoaded, setIsApolloLoaded] = useState(false);
  console.log("isApolloLoaded", isApolloLoaded);

  // Setup Apollo connection to Hasura with Cognito token and roles
  useEffect(() => {
    const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

    // TODO: make sure user is authenticated and has valid user claims
    // if (isAuthenticated && !!userClaims) {
    const clientData = {
      uri: HASURA_ENDPOINT,
      // TODO: implement proper headers
      // headers: {
      //   Authorization: `Bearer ${userClaims.__raw}`,
      //   "x-hasura-role": getHasuraRole(),
      // },
    };

    client.current = new ApolloClient(clientData);
    setIsApolloLoaded(true);
  }, [client, setIsApolloLoaded]);

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
