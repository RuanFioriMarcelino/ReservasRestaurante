import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "../screen/ErrorPage";
import Signin from "../screen/signin";

export const RouteAuth = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
]);
