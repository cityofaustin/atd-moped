import "../fake-db";
import "../styles/_app.scss";
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import MatxTheme from "./MatxLayout/MatxTheme/MatxTheme";
import AppContext from "./appContext";
import history from "history.js";
import routes from "./RootRoutes";
import { Store } from "./redux/Store";
import Auth from "./auth/Auth";
import MatxLayout from "./MatxLayout/MatxLayoutSFC";
import AuthGuard from "./auth/AuthGuard";
 import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
 


const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://coa-moped.herokuapp.com/v1/graphql',
    }),
    cache: new InMemoryCache(),
  });
 };

const client = createApolloClient();


const App = () => {
  return (
     <ApolloProvider client={client}>
    <AppContext.Provider value={{ routes }}>
      <Provider store={Store}>
        <MatxTheme>
          <Auth>
            <Router history={history} path={`${process.env.PUBLIC_URL}/`}>
              <AuthGuard>
                <MatxLayout />
              </AuthGuard>
            </Router>
          </Auth>
        </MatxTheme>
      </Provider>
    </AppContext.Provider>
     </ApolloProvider>
  );
};

export default App;
