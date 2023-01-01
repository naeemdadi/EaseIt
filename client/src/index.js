import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import { OrgProvider } from "./Contexts/OrgContaxt";
import axios from "axios";

// export const baseURL = "http://localhost:5000";
export const baseURL = "https://easeit-api.up.railway.app/";

axios.defaults.baseURL = baseURL;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrgProvider>
          <App />
        </OrgProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
