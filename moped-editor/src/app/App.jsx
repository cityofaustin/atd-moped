import "../fake-db";
import "../styles/_app.scss";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import MatxTheme from "./MatxLayout/MatxTheme/MatxTheme";
import AppContext from "./appContext";
import history from "history.js";
import routes from "./RootRoutes";
import { Store } from "./redux/Store";
// import Auth from "./auth/Auth";
import MatxLayout from "./MatxLayout/MatxLayoutSFC";
// import AuthGuard from "./auth/AuthGuard";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider 
} from '@material-ui/pickers';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { useForm, FormProvider } from 'react-hook-form';

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
  const methods = useForm({ mode: "onBlur" });
  const { watch, errors } = methods;

  useEffect(() => {
    console.log("FORM CONTEXT", watch(), errors);
  }, [watch, errors]);

  return (          
    <ApolloProvider client={client}>
      <AppContext.Provider value={{ routes }}>
        <Provider store={Store}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MatxTheme>
            <FormProvider {...methods}>
            {/* <Auth> */}
              <Router history={history} path={`${process.env.PUBLIC_URL}/`}>
                {/* <AuthGuard> */}
                  <MatxLayout />
                {/* </AuthGuard> */}
              </Router> 
            {/* </Auth> */}
            </FormProvider>
          </MatxTheme> 
          </MuiPickersUtilsProvider> 
        </Provider>
      </AppContext.Provider>
  </ApolloProvider>
  );
};

export default App;
