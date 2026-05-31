import React from "react";
import ReactDOM from "react-dom/client";
// import SatarRating from "./StarRating";
import "./index.css";
import App from "./App";
import LoginPage from "./Login";
import AdminDashboard from "./AdminDashboard";
import Root from "./Roots";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App />
    <LoginPage />
    <AdminDashboard />
    <SatarRating maxRating={10} /> */}
    <Root />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
