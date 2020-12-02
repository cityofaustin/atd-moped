import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./auth/user";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

ReactDOM.render(
  <BrowserRouter basename={"/moped"}>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
