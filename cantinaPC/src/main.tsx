import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

import { RouterApp } from "./routes";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={RouterApp} />
  </StrictMode>
);
