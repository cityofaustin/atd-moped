import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "src/theme";
import GlobalStyles from "src/components/GlobalStyles";
import { UserContext } from "../auth/user";
import { MockedProvider } from "@apollo/client/testing";
import { apolloMocks } from "./testUtilApolloMocks";

/*
 * Wrapper that contains all of the providers a React component expects to find in this app
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
const AllTheProviders = ({ children }) => {
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
    <MockedProvider mocks={apolloMocks} addTypename={false}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={mockUserContextValues}>
          <GlobalStyles />
          <BrowserRouter>{children}</BrowserRouter>
        </UserContext.Provider>
      </ThemeProvider>
    </MockedProvider>
  );
};

// create custom render method
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
