import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

import { RouterApp } from "./routes";
import { RouterProvider } from "react-router-dom";
import { auth } from "./config/firebaseconfig";
import { RouteAuth } from "./routes/authRoute";
const user = auth.currentUser;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!user ? (
      <RouterProvider router={RouterApp} />
    ) : (
      <RouterProvider router={RouteAuth} />
    )}
  </StrictMode>
);
