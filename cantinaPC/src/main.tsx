import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import router from "./routes/index.tsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
