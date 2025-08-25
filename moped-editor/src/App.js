import React, { useMemo, useState } from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import GlobalStyles from "src/components/GlobalStyles";
import theme from "src/theme";
import { restrictedRoutes } from "src/routes";
import { getHighestRole } from "./auth/user";
import { useUser, getCognitoIdJwt } from "src/auth/user";
import { setContext } from "@apollo/client/link/context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProjectListViewQueryContext from "./components/QueryContextProvider";
import ActivityMetrics from "./components/ActivityMetrics";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "src/components/FallbackComponent";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";

// Apollo GraphQL Client
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { LicenseInfo } from "@mui/x-license";

const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

var pckg = require("../package.json");
console.info(`🛵 ${pckg.name} ${pckg.version}`);

const useApolloClient = () => {
  const [error, setError] = useState(null);
  const { getCognitoSession } = useUser();

  const apolloClient = useMemo(() => {
    // see: https://www.apollographql.com/docs/react/networking/authentication/#header
    const httpLink = createHttpLink({ uri: HASURA_ENDPOINT });

    const authLink = setContext(async (_, { headers }) => {
      const session = await getCognitoSession();
      const token = getCognitoIdJwt(session);
      const role = getHighestRole(session);

      // Return the headers and role to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
          "x-hasura-role": role ? role : "",
        },
      };
    });

    const errorLink = onError(({ graphqlErrors, networkError }) => {
      if (graphqlErrors) {
        // Concatenate all error messages to create a single error and message
        const concatenatedMessage = graphqlErrors
          .map(({ message }) => message)
          .join("; ");

        const combinedError = new Error(concatenatedMessage);
        setError(combinedError);
      }

      if (networkError) {
        setError(networkError);
      }
    });

    return new ApolloClient({
      // Join authLink and httpLink to handle auth in each request
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          // a type policy must be added for any type we want to cache that
          // does not use a column called `id` as the PK
          project_list_view: {
            keyFields: ["project_id"],
          },
          // todo: these type policies only come into play when the
          // query that fetches them uses an appropriate caching policy
          moped_entity: {
            keyFields: ["entity_id"],
          },
          moped_phases: {
            keyFields: ["phase_id"],
          },
        },
      }),
    });
  }, [getCognitoSession]);

  return { apolloClient, error };
};

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUIX_LICENSE_KEY);

const App = () => {
  const [listViewQuery, setListViewQuery] = useState(null);
  const routing = useRoutes(restrictedRoutes);
  const { apolloClient: client, error } = useApolloClient();

  return (
    <ApolloProvider client={client}>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <ApolloErrorHandler error={error}>
              <ErrorBoundary FallbackComponent={FallbackComponent}>
                <GlobalStyles />
                <ActivityMetrics eventName="app_load">
                  <ProjectListViewQueryContext.Provider
                    value={{ listViewQuery, setListViewQuery }}
                  >
                    {routing}
                  </ProjectListViewQueryContext.Provider>
                </ActivityMetrics>
              </ErrorBoundary>
            </ApolloErrorHandler>
          </ThemeProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  );
};

export default App;
