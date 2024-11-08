import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

import { RouterApp } from "./routes";
import { RouterProvider } from "react-router-dom";

import { RouteAuth } from "./routes/authRoute";
import { auth } from "./config/firebaseconfig";

const token = localStorage.getItem("IsLoged");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {token && !auth.currentUser ? (
      <RouterProvider router={RouterApp} />
    ) : (
      <RouterProvider router={RouteAuth} />
    )}
  </StrictMode>
);
