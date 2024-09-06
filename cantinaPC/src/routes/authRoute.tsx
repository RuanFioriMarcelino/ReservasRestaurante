import { createBrowserRouter } from "react-router-dom";

import Signin from "../screen/signin";

export const RouteAuth = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
    errorElement: <Signin />,
  },
]);
