import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
