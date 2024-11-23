import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Dashboard } from "../screen/dashboard";
import { List } from "../screen/list";
import Details from "../screen/details";
import ErrorPage from "../screen/ErrorPage";

import Foods from "../screen/foods";
import Drink from "../screen/menssenger";
import Client from "../screen/client";
import Calendar from "../screen/calendar";
import Menssenger from "../screen/menssenger";

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
        path: "/dashboardx",
        element: <Dashboard />,
      },
      {
        path: "list",
        element: <List />,
      },
      {
        path: "details",
        element: <Details />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "client",
        element: <Client />,
      },
      {
        path: "foods",
        element: <Foods />,
      },
      {
        path: "menssenger",
        element: <Menssenger />,
      },
    ],
  },
]);
