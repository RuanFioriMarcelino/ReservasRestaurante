import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <Navigate to="/notfound" />,
  },
  {
    path: "/notfound",
    element: <h1>Error 404 not found</h1>,
  },
]);

export default router;
