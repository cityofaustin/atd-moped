import React, { useMemo, useState } from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import GlobalStyles from "src/components/GlobalStyles";
import theme from "src/theme";
import { restrictedRoutes } from "src/routes";
import { useUser, getHighestRole } from "./auth/user";
import useAuthentication from "src/auth/useAuthentication";
import { setContext } from "@apollo/client/link/context";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProjectListViewQueryContext from "./components/QueryContextProvider";
import ActivityMetrics from "./components/ActivityMetrics";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "src/components/FallbackComponent";

// Apollo GraphQL Client
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

import { LicenseInfo } from "@mui/x-license";

const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

var pckg = require("../package.json");
console.info(`🛵 ${pckg.name} ${pckg.version}`);

const useClient = (user) => {
  const { getToken } = useAuthentication();

  const apolloClient = useMemo(() => {
    // see: https://www.apollographql.com/docs/react/networking/authentication/#header
    const httpLink = createHttpLink({ uri: HASURA_ENDPOINT });

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();

      // Get the authentication token and role from user if it exists
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

    return new ApolloClient({
      // Join authLink and httpLink to handle auth in each request
      link: authLink.concat(httpLink),
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
  }, [user, getToken]);

  return apolloClient;
};

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUIX_LICENSE_KEY);

const App = () => {
  const [listViewQuery, setListViewQuery] = useState(null);
  const routing = useRoutes(restrictedRoutes);
  const { user } = useUser();
  const client = useClient(user);

  return (
    <ApolloProvider client={client}>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  );
};

export default App;
