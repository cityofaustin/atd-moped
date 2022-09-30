import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "src/theme";
import GlobalStyles from "src/components/GlobalStyles";
import { UserContext } from "../auth/user";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

/*
 * Wrapper that contains all of the providers a React component expects to find in this app
 */
const AllTheProviders = ({ children }) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
  });

  const mockUserContextValues = {
    user: {
      idToken: {
        payload: {
          "https://hasura.io/jwt/claims":
            '{"x-hasura-default-role": "moped-viewer", "x-hasura-allowed-roles": ["moped-admin"]}',
        },
      },
    },
    login: () => {
      return true;
    },
    logout: () => {
      return true;
    },
    loginLoading: false,
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={mockUserContextValues}>
          <GlobalStyles />
          <BrowserRouter>{children}</BrowserRouter>
        </UserContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

// create custom render method
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
