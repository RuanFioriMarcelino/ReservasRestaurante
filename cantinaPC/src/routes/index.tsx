import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Dashboard } from "../screen/dashboard";
import { List } from "../screen/list";
import Details from "../screen/details";
import ErrorPage from "../screen/ErrorPage";
import CreateFood from "../screen/createFood";

export const RouterApp = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "/details",
        element: <Details />,
      },
      {
        path: "/createFoods",
        element: <CreateFood />,
      },
    ],
  },
]);
